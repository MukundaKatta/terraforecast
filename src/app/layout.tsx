import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TerraForecast - Earth System Forecasting",
  description: "Advanced earth system forecasting with weather overlays, climate projections, and severe weather alerts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
