import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WeatherData = {
  id: string;
  location: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  aqi: number;
  forecast_date: string;
  created_at: string;
};

export type SevereAlert = {
  id: string;
  type: "tornado" | "hurricane" | "flood" | "heat" | "blizzard" | "thunderstorm";
  severity: "watch" | "warning" | "emergency";
  title: string;
  description: string;
  lat: number;
  lng: number;
  radius_km: number;
  expires_at: string;
  created_at: string;
};

export type ClimateProjection = {
  id: string;
  scenario: "ssp126" | "ssp245" | "ssp370" | "ssp585";
  year: number;
  global_temp_anomaly: number;
  sea_level_rise_mm: number;
  co2_ppm: number;
};
