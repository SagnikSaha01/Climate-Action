import pandas as pd
import json

# Read the climate data
df = pd.read_csv('kolkata_climate_power.csv')

# Calculate yearly total rainfall
# The data is in mm/day per month, so we need to sum up all months
yearly_rainfall = df.groupby('YEAR')['rainfall_mm'].sum().reset_index()
yearly_rainfall.columns = ['year', 'rainfall']

# Round to 2 decimal places
yearly_rainfall['rainfall'] = yearly_rainfall['rainfall'].round(2)

# Convert to list of dictionaries
data = yearly_rainfall.to_dict('records')

# Save as JSON
with open('../frontend/src/rainfallData.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Converted {len(data)} years of rainfall data to JSON")
print(f"Yearly total rainfall range: {yearly_rainfall['rainfall'].min():.2f} - {yearly_rainfall['rainfall'].max():.2f} mm/day (summed)")
