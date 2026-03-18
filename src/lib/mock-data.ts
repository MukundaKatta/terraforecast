import { WeatherData, SevereAlert, ClimateProjection } from "./supabase";

export function generateForecastData(lat: number, lng: number, days: number): WeatherData[] {
  const data: WeatherData[] = [];
  const baseTemp = 20 - Math.abs(lat) * 0.4 + Math.sin(lng * 0.01) * 5;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayVariation = Math.sin((i / days) * Math.PI) * 5;
    const randomVariation = (Math.random() - 0.5) * 8;

    data.push({
      id: `forecast-${i}`,
      location: `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      lat,
      lng,
      temperature: Math.round((baseTemp + dayVariation + randomVariation) * 10) / 10,
      humidity: Math.round(40 + Math.random() * 50),
      wind_speed: Math.round(Math.random() * 30 * 10) / 10,
      pressure: Math.round(1013 + (Math.random() - 0.5) * 30),
      aqi: Math.round(20 + Math.random() * 150),
      forecast_date: date.toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    });
  }
  return data;
}

export function generateSevereAlerts(): SevereAlert[] {
  return [
    {
      id: "alert-1",
      type: "hurricane",
      severity: "warning",
      title: "Hurricane Maria - Category 3",
      description: "Major hurricane approaching the Gulf Coast with sustained winds of 120 mph. Expected landfall within 48 hours.",
      lat: 25.7,
      lng: -89.1,
      radius_km: 350,
      expires_at: new Date(Date.now() + 72 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-2",
      type: "tornado",
      severity: "emergency",
      title: "Tornado Warning - Oklahoma",
      description: "Large and extremely dangerous tornado detected. Take shelter immediately.",
      lat: 35.4,
      lng: -97.5,
      radius_km: 30,
      expires_at: new Date(Date.now() + 2 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-3",
      type: "flood",
      severity: "watch",
      title: "Flash Flood Watch - Pacific Northwest",
      description: "Heavy rainfall expected over the next 24 hours. Flash flooding possible in low-lying areas.",
      lat: 47.6,
      lng: -122.3,
      radius_km: 150,
      expires_at: new Date(Date.now() + 24 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-4",
      type: "heat",
      severity: "warning",
      title: "Extreme Heat Warning - Southwest",
      description: "Dangerously high temperatures expected. Heat index values up to 115F.",
      lat: 33.4,
      lng: -112.0,
      radius_km: 200,
      expires_at: new Date(Date.now() + 48 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: "alert-5",
      type: "blizzard",
      severity: "warning",
      title: "Blizzard Warning - Northern Plains",
      description: "Heavy snow and high winds expected. Travel will be extremely hazardous.",
      lat: 46.8,
      lng: -100.7,
      radius_km: 250,
      expires_at: new Date(Date.now() + 36 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
    },
  ];
}

export function generateClimateProjections(): ClimateProjection[] {
  const scenarios: Array<"ssp126" | "ssp245" | "ssp370" | "ssp585"> = [
    "ssp126", "ssp245", "ssp370", "ssp585",
  ];
  const projections: ClimateProjection[] = [];

  for (const scenario of scenarios) {
    for (let year = 2025; year <= 2100; year += 5) {
      const t = (year - 2025) / 75;
      let tempAnomaly: number;
      let seaLevel: number;
      let co2: number;

      switch (scenario) {
        case "ssp126":
          tempAnomaly = 0.5 + t * 1.0;
          seaLevel = 50 + t * 300;
          co2 = 420 + t * 30 - t * t * 20;
          break;
        case "ssp245":
          tempAnomaly = 0.5 + t * 1.8;
          seaLevel = 50 + t * 450;
          co2 = 420 + t * 100;
          break;
        case "ssp370":
          tempAnomaly = 0.5 + t * 2.8;
          seaLevel = 50 + t * 600;
          co2 = 420 + t * 250;
          break;
        case "ssp585":
          tempAnomaly = 0.5 + t * 4.5;
          seaLevel = 50 + t * 800;
          co2 = 420 + t * 500 + t * t * 200;
          break;
      }

      projections.push({
        id: `${scenario}-${year}`,
        scenario,
        year,
        global_temp_anomaly: Math.round(tempAnomaly * 100) / 100,
        sea_level_rise_mm: Math.round(seaLevel),
        co2_ppm: Math.round(co2),
      });
    }
  }
  return projections;
}

export function generateAirQualityGrid(): Array<{ lat: number; lng: number; aqi: number; pm25: number; pm10: number; o3: number }> {
  const grid: Array<{ lat: number; lng: number; aqi: number; pm25: number; pm10: number; o3: number }> = [];
  for (let lat = -60; lat <= 70; lat += 10) {
    for (let lng = -170; lng <= 170; lng += 10) {
      const urbanFactor = Math.abs(lat) < 50 ? 1.5 : 0.8;
      const baseAqi = 30 + Math.random() * 100 * urbanFactor;
      grid.push({
        lat,
        lng,
        aqi: Math.round(baseAqi),
        pm25: Math.round(baseAqi * 0.4),
        pm10: Math.round(baseAqi * 0.6),
        o3: Math.round(20 + Math.random() * 60),
      });
    }
  }
  return grid;
}
