"use client";

import { useMemo } from "react";
import { generateSevereAlerts } from "@/lib/mock-data";
import {
  AlertTriangle, Zap, CloudRain, Flame, Snowflake, Wind, Clock, MapPin,
} from "lucide-react";

const alertIcons: Record<string, React.ReactNode> = {
  hurricane: <Wind size={20} />,
  tornado: <Zap size={20} />,
  flood: <CloudRain size={20} />,
  heat: <Flame size={20} />,
  blizzard: <Snowflake size={20} />,
  thunderstorm: <Zap size={20} />,
};

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  emergency: { label: "EMERGENCY", color: "text-red-400", bg: "bg-red-500/20 border-red-500/40" },
  warning: { label: "WARNING", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/40" },
  watch: { label: "WATCH", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/40" },
};

export default function AlertsPanel() {
  const alerts = useMemo(() => generateSevereAlerts(), []);

  const sorted = [...alerts].sort((a, b) => {
    const order = { emergency: 0, warning: 1, watch: 2 };
    return order[a.severity] - order[b.severity];
  });

  const activeCount = alerts.length;
  const emergencyCount = alerts.filter((a) => a.severity === "emergency").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertTriangle size={22} className="text-amber-400" /> Severe Weather Alerts
        </h2>
        <p className="text-sm text-slate-400">Active alerts and warnings</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel p-4 text-center">
          <div className="text-3xl font-bold text-white">{activeCount}</div>
          <div className="text-xs text-slate-500">Active Alerts</div>
        </div>
        <div className="glass-panel p-4 text-center border-red-500/30 border">
          <div className="text-3xl font-bold text-red-400">{emergencyCount}</div>
          <div className="text-xs text-slate-500">Emergencies</div>
        </div>
        <div className="glass-panel p-4 text-center border-amber-500/30 border">
          <div className="text-3xl font-bold text-amber-400">{warningCount}</div>
          <div className="text-xs text-slate-500">Warnings</div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {sorted.map((alert) => {
          const sev = severityConfig[alert.severity];
          const expiresIn = Math.max(
            0,
            Math.round((new Date(alert.expires_at).getTime() - Date.now()) / 3600000)
          );

          return (
            <div
              key={alert.id}
              className={`glass-panel p-5 border ${sev.bg} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${sev.bg} ${sev.color}`}>
                  {alertIcons[alert.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${sev.bg} ${sev.color}`}>
                      {sev.label}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">{alert.type}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{alert.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {alert.lat.toFixed(1)}N, {Math.abs(alert.lng).toFixed(1)}
                      {alert.lng < 0 ? "W" : "E"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Expires in {expiresIn}h
                    </span>
                    <span>Radius: {alert.radius_km}km</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Tips */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Safety Guidelines</h3>
        <div className="space-y-3 text-xs text-slate-400">
          <div className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <p><strong className="text-red-400">Emergency:</strong> Take immediate action. Seek shelter and follow local authority instructions.</p>
          </div>
          <div className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <p><strong className="text-amber-400">Warning:</strong> Severe weather is imminent or occurring. Prepare for impact and stay alert.</p>
          </div>
          <div className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <p><strong className="text-blue-400">Watch:</strong> Conditions are favorable for severe weather. Monitor updates and be prepared.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
