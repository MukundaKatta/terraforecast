import { create } from "zustand";

export type ViewMode = "globe" | "weather" | "airquality" | "climate" | "alerts";

interface TerraStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedLocation: { lat: number; lng: number; name: string } | null;
  setSelectedLocation: (loc: { lat: number; lng: number; name: string } | null) => void;
  forecastDays: number;
  setForecastDays: (days: number) => void;
  climateScenario: string;
  setClimateScenario: (scenario: string) => void;
  mapStyle: string;
  setMapStyle: (style: string) => void;
  showAlerts: boolean;
  setShowAlerts: (show: boolean) => void;
  dateRange: { start: Date; end: Date };
  setDateRange: (range: { start: Date; end: Date }) => void;
}

export const useTerraStore = create<TerraStore>((set) => ({
  viewMode: "globe",
  setViewMode: (mode) => set({ viewMode: mode }),
  selectedLocation: null,
  setSelectedLocation: (loc) => set({ selectedLocation: loc }),
  forecastDays: 7,
  setForecastDays: (days) => set({ forecastDays: days }),
  climateScenario: "ssp245",
  setClimateScenario: (scenario) => set({ climateScenario: scenario }),
  mapStyle: "mapbox://styles/mapbox/dark-v11",
  setMapStyle: (style) => set({ mapStyle: style }),
  showAlerts: true,
  setShowAlerts: (show) => set({ showAlerts: show }),
  dateRange: {
    start: new Date(),
    end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  setDateRange: (range) => set({ dateRange: range }),
}));
