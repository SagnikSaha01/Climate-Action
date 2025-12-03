import requests
import pandas as pd
from io import StringIO

# Kolkata coordinates
lat = 22.5726
lon = 88.3639

# Data range (use YYYY format, NASA POWER data starts 1981)
start = "1981"
end = "2024"

# NASA POWER API endpoint
url = (
    "https://power.larc.nasa.gov/api/temporal/monthly/point?"
    f"start={start}&end={end}&latitude={lat}&longitude={lon}"
    "&parameters=PRECTOT,T2M"  # rainfall + temperature
    "&community=AG"
    "&format=CSV"
    "&time-standard=UTC"
)

print("Requesting NASA POWER rainfall & temperature data...")

response = requests.get(url)
response.raise_for_status()

# POWER has header info — find where CSV starts
lines = response.text.splitlines()
csv_start = 0
for i, line in enumerate(lines):
    if "PARAMETER" in line and "YEAR" in line:
        csv_start = i
        break

csv_data = "\n".join(lines[csv_start:])

# Read the wide-format data
df = pd.read_csv(StringIO(csv_data))

# Drop the ANN (annual) column if present
if 'ANN' in df.columns:
    df = df.drop(columns=['ANN'])

# Melt from wide to long format
month_cols = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
df = df.melt(id_vars=['PARAMETER', 'YEAR'], value_vars=month_cols, var_name='MONTH', value_name='VALUE')

# Convert month names to numbers
month_map = {'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
             'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12}
df['MNTH'] = df['MONTH'].map(month_map)

# Create date column
df["DATE"] = pd.to_datetime(
    df["YEAR"].astype(str) + "-" + df["MNTH"].astype(str).str.zfill(2) + "-01"
)

# Pivot to get separate columns for each parameter
df_pivot = df.pivot_table(index=['DATE', 'YEAR', 'MNTH'], columns='PARAMETER', values='VALUE').reset_index()

# Rename columns for clarity
df_pivot.columns.name = None
if 'PRECTOTCORR' in df_pivot.columns:
    df_pivot = df_pivot.rename(columns={'PRECTOTCORR': 'rainfall_mm'})
elif 'PRECTOT' in df_pivot.columns:
    df_pivot = df_pivot.rename(columns={'PRECTOT': 'rainfall_mm'})

if 'T2M' in df_pivot.columns:
    df_pivot = df_pivot.rename(columns={'T2M': 'temperature_C'})

# Keep relevant columns
df_final = df_pivot[["DATE", "YEAR", "MNTH", "rainfall_mm", "temperature_C"]]

df_final.to_csv("kolkata_climate_power.csv", index=False)

print("\nSaved file: kolkata_climate_power.csv")
