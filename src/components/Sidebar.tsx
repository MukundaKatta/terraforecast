"use client";

import { useTerraStore, ViewMode } from "@/lib/store";
import {
  Globe2,
  CloudSun,
  Wind,
  Thermometer,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const navItems: { mode: ViewMode; icon: React.ReactNode; label: string; desc: string }[] = [
  { mode: "globe", icon: <Globe2 size={20} />, label: "Globe View", desc: "3D Earth visualization" },
  { mode: "weather", icon: <CloudSun size={20} />, label: "Weather", desc: "15-day forecast" },
  { mode: "airquality", icon: <Wind size={20} />, label: "Air Quality", desc: "Global AQI overlay" },
  { mode: "climate", icon: <Thermometer size={20} />, label: "Climate", desc: "Future projections" },
  { mode: "alerts", icon: <AlertTriangle size={20} />, label: "Alerts", desc: "Severe weather" },
];

export default function Sidebar() {
  const { viewMode, setViewMode, selectedLocation } = useTerraStore();

  return (
    <div className="w-72 h-full glass-panel flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Globe2 size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">TerraForecast</h1>
            <p className="text-xs text-slate-400">Earth System Forecasting</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setViewMode(item.mode)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              viewMode === item.mode
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            {item.icon}
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs opacity-60">{item.desc}</div>
            </div>
            {viewMode === item.mode && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>

      {/* Selected Location */}
      {selectedLocation && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="glass-panel p-3">
            <p className="text-xs text-slate-400 mb-1">Selected Location</p>
            <p className="text-sm font-medium text-white">{selectedLocation.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedLocation.lat}, {selectedLocation.lng}
            </p>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-slate-500">Live data streaming</span>
        </div>
      </div>
    </div>
  );
}
