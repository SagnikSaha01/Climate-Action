import requests
import pandas as pd
from io import StringIO

lat = 22.5726
lon = 88.3639

url = (
    "https://power.larc.nasa.gov/api/temporal/monthly/point?"
    f"parameters=T2M&community=AG&latitude={lat}&longitude={lon}"
    "&start=1981&end=2024&format=CSV"
)

r = requests.get(url)
text = r.text

# NASA POWER adds headers—find actual CSV start
lines = text.splitlines()
start = 0  # Default to beginning if no header found
for i, line in enumerate(lines):
    if "PARAMETER" in line and "YEAR" in line:
        start = i
        break

csv = "\n".join(lines[start:])

# Read the CSV which has months as columns
df = pd.read_csv(StringIO(csv))

# The data is in wide format: PARAMETER,YEAR,JAN,FEB,MAR,...
# We need to convert it to long format with DATE and T2M columns
# Drop the PARAMETER column and melt the month columns
df = df.drop(columns=['PARAMETER'])

# Melt the dataframe to convert month columns to rows
month_cols = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
df = df.melt(id_vars=['YEAR'], value_vars=month_cols, var_name='MONTH', value_name='T2M')

# Convert month names to numbers
month_map = {'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4, 'MAY': 5, 'JUN': 6,
             'JUL': 7, 'AUG': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12}
df['MNTH'] = df['MONTH'].map(month_map)

# Create DATE column
df["DATE"] = pd.to_datetime(
    df["YEAR"].astype(str) + "-" + df["MNTH"].astype(str).str.zfill(2) + "-01"
)

# Select and order columns
df = df[["DATE", "YEAR", "MNTH", "T2M"]]

df.to_csv("kolkata_monthly_temperature.csv", index=False)
print("Saved kolkata_monthly_temperature.csv")
