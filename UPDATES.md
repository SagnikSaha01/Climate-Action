# Climate Action Project - Updates

## What Was Added

### 1. Real Kolkata Temperature Data Integration
- **Data Source**: NASA POWER Project (1981-2024)
- **Location**: Kolkata, India (22.5726°N, 88.3639°E)
- **Metric**: Temperature at 2 Meters (T2M) - Monthly averages

### 2. New Interactive Components

#### ScrollTemperature Component
- **Location**: `frontend/src/components/ScrollTemperature.jsx`
- **Features**:
  - Scroll-driven temperature animation that increases as you scroll
  - Temperature rises from 1981 baseline (~25.3°C) to 2024 level (~27.6°C)
  - Background color transitions from cool blue to warm red
  - Animated heat wave indicators
  - Shows year and current temperature dynamically

#### TemperatureChart Component
- **Location**: `frontend/src/components/TemperatureChart.jsx`
- **Features**:
  - Interactive bar chart showing yearly average temperatures
  - Each bar reveals temperature on hover
  - Bars animate into view as you scroll
  - Color gradient based on temperature (cooler = blue-ish, warmer = red)
  - Displays actual calculated temperature increase

### 3. Data Processing
- **Script**: `backend/collectData.py` - Fixed and working
- **Output**: `backend/kolkata_monthly_temperature.csv` - Raw monthly data
- **Frontend Data**: `frontend/src/temperatureData.json` - Yearly averages for visualization

### 4. Key Statistics (From Real Data)
- **Temperature Increase**: +2.1°C from early 1980s to 2020s
- **Starting Average (1981-1985)**: ~25.5°C
- **Recent Average (2020-2024)**: ~27.6°C
- **Data Points**: 44 years of continuous monthly temperature measurements

### 5. User Experience Flow
1. **Hero Section** - Initial introduction
2. **Why Section** - Personal connection to Kolkata
3. **Scroll Temperature** - Interactive scroll experience showing temperature rising
4. **Data Section** - Real statistics with NASA data source
5. **Temperature Chart** - Detailed visualization of 44 years of data
6. **Flooding Section** - Visual impact imagery
7. **Superpower & Final Message** - Call to action

## How to Run

### Backend (Data Collection)
```bash
cd backend
python collectData.py
```

### Frontend (React App)
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5174

## Technologies Used
- **React 19** - UI framework
- **Framer Motion** - Scroll animations and transitions
- **Vite** - Build tool
- **NASA POWER API** - Climate data source
- **Python + Pandas** - Data processing

## Impact
The app now uses real, scientifically-sourced data to show the concrete impact of climate change on Kolkata, making the story more powerful and credible through interactive visualizations.
