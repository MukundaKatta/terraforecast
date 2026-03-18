"use client";

import { useState, useMemo } from "react";
import { useTerraStore } from "@/lib/store";
import { generateForecastData } from "@/lib/mock-data";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area,
} from "recharts";
import {
  Droplets, Wind, Gauge, ThermometerSun, Eye, Calendar,
} from "lucide-react";

export default function WeatherPanel() {
  const { selectedLocation, forecastDays, setForecastDays } = useTerraStore();
  const [metric, setMetric] = useState<"temperature" | "humidity" | "wind_speed" | "pressure">("temperature");

  const location = selectedLocation || { lat: 40.71, lng: -74.01, name: "New York, NY" };

  const forecast = useMemo(
    () => generateForecastData(location.lat, location.lng, forecastDays),
    [location.lat, location.lng, forecastDays]
  );

  const current = forecast[0];

  const metricConfig = {
    temperature: { label: "Temperature", unit: "C", color: "#f59e0b", icon: <ThermometerSun size={16} /> },
    humidity: { label: "Humidity", unit: "%", color: "#3b82f6", icon: <Droplets size={16} /> },
    wind_speed: { label: "Wind Speed", unit: "km/h", color: "#10b981", icon: <Wind size={16} /> },
    pressure: { label: "Pressure", unit: "hPa", color: "#8b5cf6", icon: <Gauge size={16} /> },
  };

  const cfg = metricConfig[metric];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Weather Forecast</h2>
          <p className="text-sm text-slate-400">{location.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <select
            value={forecastDays}
            onChange={(e) => setForecastDays(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value={3}>3 Days</option>
            <option value={7}>7 Days</option>
            <option value={10}>10 Days</option>
            <option value={15}>15 Days</option>
          </select>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-4 gap-3">
        {(["temperature", "humidity", "wind_speed", "pressure"] as const).map((m) => {
          const c = metricConfig[m];
          return (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`glass-panel p-4 text-center transition-all ${
                metric === m ? "ring-2 ring-blue-500/50" : "hover:bg-slate-800/50"
              }`}
            >
              <div className="flex justify-center mb-2 text-slate-400">{c.icon}</div>
              <div className="text-2xl font-bold text-white">
                {Math.round(current[m])}
                <span className="text-xs text-slate-400 ml-1">{c.unit}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{c.label}</div>
            </button>
          );
        })}
      </div>

      {/* Main Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">
          {cfg.label} Forecast ({forecastDays} days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={forecast}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="forecast_date"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={cfg.color}
              strokeWidth={2}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Breakdown */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Daily Breakdown</h3>
        <div className="space-y-2">
          {forecast.slice(0, 7).map((day, i) => {
            const date = new Date(day.forecast_date);
            const aqiColor =
              day.aqi < 50 ? "bg-green-500" :
              day.aqi < 100 ? "bg-yellow-500" :
              day.aqi < 150 ? "bg-orange-500" : "bg-red-500";

            return (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-800 last:border-0">
                <div className="w-24 text-sm text-slate-400">
                  {date.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="text-sm font-medium w-16">
                    {Math.round(day.temperature)}°C
                  </div>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (day.temperature + 10) * 2)}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 w-16">{day.humidity}%</div>
                  <div className="text-xs text-slate-500 w-20">{day.wind_speed} km/h</div>
                  <div className={`w-3 h-3 rounded-full ${aqiColor}`} title={`AQI: ${day.aqi}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Humidity vs Wind */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Humidity & Wind Speed</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={forecast.slice(0, 7)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="forecast_date"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => new Date(v).toLocaleDateString("en", { weekday: "short" })}
            />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Bar dataKey="humidity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="wind_speed" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
