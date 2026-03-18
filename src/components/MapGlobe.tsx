"use client";

import { useEffect, useRef, useState } from "react";
import { useTerraStore } from "@/lib/store";
import { generateSevereAlerts, generateAirQualityGrid } from "@/lib/mock-data";

export default function MapGlobe() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const { viewMode, mapStyle, showAlerts, setSelectedLocation } = useTerraStore();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.demo";

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: mapStyle,
        center: [0, 20],
        zoom: 1.8,
        projection: "globe" as any,
        fog: {
          color: "rgb(15, 23, 42)",
          "high-color": "rgb(30, 41, 59)",
          "horizon-blend": 0.08,
          "space-color": "rgb(8, 12, 24)",
          "star-intensity": 0.6,
        } as any,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        setMapLoaded(true);
        addWeatherLayer();
      });

      map.current.on("click", (e: any) => {
        setSelectedLocation({
          lat: Math.round(e.lngLat.lat * 100) / 100,
          lng: Math.round(e.lngLat.lng * 100) / 100,
          name: `${e.lngLat.lat.toFixed(2)}N, ${e.lngLat.lng.toFixed(2)}E`,
        });
      });
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const addWeatherLayer = () => {
    if (!map.current) return;
    const m = map.current;

    if (!m.getSource("weather-grid")) {
      const features = generateAirQualityGrid().map((point) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [point.lng, point.lat],
        },
        properties: {
          aqi: point.aqi,
          pm25: point.pm25,
          pm10: point.pm10,
          o3: point.o3,
        },
      }));

      m.addSource("weather-grid", {
        type: "geojson",
        data: { type: "FeatureCollection", features },
      });

      m.addLayer({
        id: "aqi-heat",
        type: "heatmap",
        source: "weather-grid",
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "aqi"], 0, 0, 200, 1],
          "heatmap-intensity": 0.6,
          "heatmap-radius": 40,
          "heatmap-color": [
            "interpolate", ["linear"], ["heatmap-density"],
            0, "rgba(0,0,0,0)",
            0.2, "rgba(34,197,94,0.4)",
            0.4, "rgba(234,179,8,0.5)",
            0.6, "rgba(249,115,22,0.6)",
            0.8, "rgba(239,68,68,0.7)",
            1, "rgba(147,51,234,0.8)",
          ],
          "heatmap-opacity": 0.7,
        },
        layout: { visibility: "none" },
      });
    }

    if (!m.getSource("alerts")) {
      const alerts = generateSevereAlerts();
      const alertFeatures = alerts.map((alert) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [alert.lng, alert.lat],
        },
        properties: {
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          radius: alert.radius_km,
        },
      }));

      m.addSource("alerts", {
        type: "geojson",
        data: { type: "FeatureCollection", features: alertFeatures },
      });

      m.addLayer({
        id: "alert-circles",
        type: "circle",
        source: "alerts",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 8, 5, 25],
          "circle-color": [
            "match", ["get", "severity"],
            "emergency", "#ef4444",
            "warning", "#f59e0b",
            "watch", "#3b82f6",
            "#6b7280",
          ],
          "circle-opacity": 0.6,
          "circle-stroke-width": 2,
          "circle-stroke-color": [
            "match", ["get", "severity"],
            "emergency", "#fca5a5",
            "warning", "#fcd34d",
            "watch", "#93c5fd",
            "#9ca3af",
          ],
        },
        layout: { visibility: "visible" },
      });
    }
  };

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const m = map.current;
    if (m.getLayer("aqi-heat")) {
      m.setLayoutProperty(
        "aqi-heat",
        "visibility",
        viewMode === "airquality" ? "visible" : "none"
      );
    }
    if (m.getLayer("alert-circles")) {
      m.setLayoutProperty(
        "alert-circles",
        "visibility",
        showAlerts || viewMode === "alerts" ? "visible" : "none"
      );
    }
  }, [viewMode, showAlerts, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full spin-slow" />
            <p className="text-slate-400">Loading Earth visualization...</p>
          </div>
        </div>
      )}
    </div>
  );
}
