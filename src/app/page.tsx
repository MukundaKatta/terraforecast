"use client";

import dynamic from "next/dynamic";
import { useTerraStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import WeatherPanel from "@/components/WeatherPanel";
import AirQualityPanel from "@/components/AirQualityPanel";
import ClimatePanel from "@/components/ClimatePanel";
import AlertsPanel from "@/components/AlertsPanel";

const MapGlobe = dynamic(() => import("@/components/MapGlobe"), { ssr: false });

export default function HomePage() {
  const { viewMode } = useTerraStore();

  const showRightPanel = viewMode !== "globe";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex">
        {/* Map */}
        <div className={`${showRightPanel ? "w-1/2" : "w-full"} h-full relative transition-all duration-300`}>
          <MapGlobe />
          {/* Map Overlay Info */}
          <div className="absolute top-4 left-4 glass-panel px-4 py-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Mode:</span>
              <span className="text-white font-medium capitalize">{viewMode}</span>
              <div className="w-px h-4 bg-slate-700" />
              <span className="text-slate-400">Click map to select location</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {showRightPanel && (
          <div className="w-1/2 h-full border-l border-slate-700/50 bg-slate-950">
            {viewMode === "weather" && <WeatherPanel />}
            {viewMode === "airquality" && <AirQualityPanel />}
            {viewMode === "climate" && <ClimatePanel />}
            {viewMode === "alerts" && <AlertsPanel />}
          </div>
        )}
      </div>
    </div>
  );
}
