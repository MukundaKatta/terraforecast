# TerraForecast

Earth observation and environmental forecasting platform with interactive maps, weather data, air quality, and climate analysis.

## Features

- **Interactive Globe** -- Mapbox-powered geographic visualization with satellite imagery
- **Weather Panel** -- Real-time weather data for selected locations worldwide
- **Air Quality Monitor** -- Track air quality indices and pollutant levels
- **Climate Analysis** -- Long-term climate trend visualization and projections
- **Alert System** -- Environmental alerts for extreme weather and air quality events
- **Multi-View Modes** -- Switch between globe, weather, air quality, and climate views
- **Location Selector** -- Click-to-select any location on the interactive map

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Mapping:** Mapbox GL
- **Charts:** Recharts
- **State Management:** Zustand
- **Database:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd terraforecast
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
terraforecast/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── Sidebar.tsx
│   │   ├── MapGlobe.tsx
│   │   ├── WeatherPanel.tsx
│   │   ├── AirQualityPanel.tsx
│   │   ├── ClimatePanel.tsx
│   │   └── AlertsPanel.tsx
│   └── lib/              # Utilities, store, mock data
├── public/               # Static assets
└── package.json
```

## License

MIT
