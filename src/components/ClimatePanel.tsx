"use client";

import { useMemo } from "react";
import { useTerraStore } from "@/lib/store";
import { generateClimateProjections } from "@/lib/mock-data";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, AreaChart, Area,
} from "recharts";
import { Thermometer, Waves, Factory, TrendingUp } from "lucide-react";

const SCENARIO_COLORS: Record<string, string> = {
  ssp126: "#22c55e",
  ssp245: "#3b82f6",
  ssp370: "#f59e0b",
  ssp585: "#ef4444",
};

const SCENARIO_LABELS: Record<string, string> = {
  ssp126: "SSP1-2.6 (Sustainable)",
  ssp245: "SSP2-4.5 (Middle Road)",
  ssp370: "SSP3-7.0 (Regional Rivalry)",
  ssp585: "SSP5-8.5 (Fossil Fuel)",
};

export default function ClimatePanel() {
  const { climateScenario, setClimateScenario } = useTerraStore();
  const projections = useMemo(() => generateClimateProjections(), []);

  const years = [...new Set(projections.map((p) => p.year))];

  const tempData = years.map((year) => {
    const row: any = { year };
    Object.keys(SCENARIO_COLORS).forEach((sc) => {
      const proj = projections.find((p) => p.year === year && p.scenario === sc);
      if (proj) row[sc] = proj.global_temp_anomaly;
    });
    return row;
  });

  const seaLevelData = years.map((year) => {
    const row: any = { year };
    Object.keys(SCENARIO_COLORS).forEach((sc) => {
      const proj = projections.find((p) => p.year === year && p.scenario === sc);
      if (proj) row[sc] = proj.sea_level_rise_mm;
    });
    return row;
  });

  const co2Data = years.map((year) => {
    const row: any = { year };
    Object.keys(SCENARIO_COLORS).forEach((sc) => {
      const proj = projections.find((p) => p.year === year && p.scenario === sc);
      if (proj) row[sc] = proj.co2_ppm;
    });
    return row;
  });

  const selected2100 = projections.find(
    (p) => p.year === 2100 && p.scenario === climateScenario
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Thermometer size={22} /> Climate Projections
        </h2>
        <p className="text-sm text-slate-400">IPCC AR6 scenario-based projections (2025-2100)</p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(SCENARIO_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setClimateScenario(key)}
            className={`glass-panel p-3 text-left transition-all ${
              climateScenario === key
                ? "ring-2"
                : "hover:bg-slate-800/50"
            }`}
            style={{
              ringColor: SCENARIO_COLORS[key],
              borderColor: climateScenario === key ? SCENARIO_COLORS[key] : undefined,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS[key] }} />
              <span className="text-xs font-mono text-slate-400">{key.toUpperCase()}</span>
            </div>
            <div className="text-xs text-slate-300">{label}</div>
          </button>
        ))}
      </div>

      {/* 2100 Summary */}
      {selected2100 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-panel p-4 text-center">
            <TrendingUp size={18} className="mx-auto mb-2 text-red-400" />
            <div className="text-2xl font-bold text-white">
              +{selected2100.global_temp_anomaly}°C
            </div>
            <div className="text-xs text-slate-500">Temp by 2100</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <Waves size={18} className="mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">
              +{(selected2100.sea_level_rise_mm / 10).toFixed(0)}cm
            </div>
            <div className="text-xs text-slate-500">Sea Level Rise</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <Factory size={18} className="mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold text-white">
              {selected2100.co2_ppm}
            </div>
            <div className="text-xs text-slate-500">CO2 ppm</div>
          </div>
        </div>
      )}

      {/* Temperature Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Global Temperature Anomaly (°C)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            <Legend />
            {Object.entries(SCENARIO_COLORS).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={climateScenario === key ? 3 : 1.5}
                dot={false}
                name={key.toUpperCase()}
                opacity={climateScenario === key ? 1 : 0.4}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sea Level Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Sea Level Rise (mm)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={seaLevelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            {Object.entries(SCENARIO_COLORS).map(([key, color]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                fill={color}
                fillOpacity={climateScenario === key ? 0.2 : 0.05}
                strokeWidth={climateScenario === key ? 2 : 1}
                name={key.toUpperCase()}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CO2 Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">CO2 Concentration (ppm)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={co2Data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
            />
            {Object.entries(SCENARIO_COLORS).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={climateScenario === key ? 3 : 1.5}
                dot={false}
                name={key.toUpperCase()}
                opacity={climateScenario === key ? 1 : 0.4}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
