import requests

# Kolkata coordinates
lat = 22.5726
lon = 88.3639

# Data range
start = "1981"
end = "2024"

# NASA POWER API endpoint
url = (
    "https://power.larc.nasa.gov/api/temporal/monthly/point?"
    f"start={start}&end={end}&latitude={lat}&longitude={lon}"
    "&parameters=PRECTOT,T2M"
    "&community=AG"
    "&format=CSV"
    "&time-standard=UTC"
)

print("Requesting data...")
response = requests.get(url)
response.raise_for_status()

print("\n=== First 50 lines of response ===\n")
lines = response.text.splitlines()
for i, line in enumerate(lines[:50]):
    print(f"{i:3d}: {line}")
