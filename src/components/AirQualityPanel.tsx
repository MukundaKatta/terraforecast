"use client";

import { useMemo } from "react";
import { generateAirQualityGrid } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Wind, AlertCircle, MapPin, Activity } from "lucide-react";

const AQI_LEVELS = [
  { label: "Good", range: "0-50", color: "#22c55e", max: 50 },
  { label: "Moderate", range: "51-100", color: "#eab308", max: 100 },
  { label: "Unhealthy (Sensitive)", range: "101-150", color: "#f97316", max: 150 },
  { label: "Unhealthy", range: "151-200", color: "#ef4444", max: 200 },
  { label: "Very Unhealthy", range: "201-300", color: "#a855f7", max: 300 },
  { label: "Hazardous", range: "300+", color: "#881337", max: 500 },
];

export default function AirQualityPanel() {
  const grid = useMemo(() => generateAirQualityGrid(), []);

  const distribution = useMemo(() => {
    const counts = AQI_LEVELS.map((level) => ({
      name: level.label,
      color: level.color,
      count: 0,
    }));
    grid.forEach((point) => {
      const idx = AQI_LEVELS.findIndex((l) => point.aqi <= l.max);
      if (idx >= 0) counts[idx].count++;
      else counts[counts.length - 1].count++;
    });
    return counts;
  }, [grid]);

  const topPolluted = useMemo(() => {
    return [...grid]
      .sort((a, b) => b.aqi - a.aqi)
      .slice(0, 8)
      .map((p) => ({
        location: `${p.lat.toFixed(0)}N, ${p.lng.toFixed(0)}E`,
        aqi: p.aqi,
        pm25: p.pm25,
        pm10: p.pm10,
        o3: p.o3,
      }));
  }, [grid]);

  const avgAqi = Math.round(grid.reduce((s, p) => s + p.aqi, 0) / grid.length);
  const getAqiLevel = (aqi: number) => AQI_LEVELS.find((l) => aqi <= l.max) || AQI_LEVELS[5];
  const currentLevel = getAqiLevel(avgAqi);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Wind size={22} /> Air Quality Index
        </h2>
        <p className="text-sm text-slate-400">Global air quality monitoring</p>
      </div>

      {/* Global Average */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-6">
          <div
            className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center"
            style={{ backgroundColor: currentLevel.color + "30", border: `2px solid ${currentLevel.color}` }}
          >
            <span className="text-3xl font-bold" style={{ color: currentLevel.color }}>{avgAqi}</span>
            <span className="text-xs text-slate-400">AQI</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: currentLevel.color }}>
              {currentLevel.label}
            </h3>
            <p className="text-sm text-slate-400 mt-1">Global average across {grid.length} monitoring stations</p>
          </div>
        </div>
      </div>

      {/* AQI Scale */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">AQI Scale</h3>
        <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-3">
          {AQI_LEVELS.map((level) => (
            <div
              key={level.label}
              className="flex-1"
              style={{ backgroundColor: level.color }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {AQI_LEVELS.map((level) => (
            <div key={level.label} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: level.color }} />
              <span className="text-slate-400">{level.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Station Distribution</h3>
        <div className="flex gap-6">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={65}>
                  {distribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="text-white font-medium">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Polluted */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-400" /> Most Polluted Regions
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topPolluted} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="location"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Bar dataKey="aqi" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pollutant Breakdown */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <Activity size={16} /> Pollutant Breakdown (Top Regions)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topPolluted.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="location" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Bar dataKey="pm25" fill="#f59e0b" name="PM2.5" />
            <Bar dataKey="pm10" fill="#8b5cf6" name="PM10" />
            <Bar dataKey="o3" fill="#06b6d4" name="O3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
