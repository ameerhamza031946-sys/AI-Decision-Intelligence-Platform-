import { useEffect, useRef } from 'react';

const RISK_COLORS = {
  Critical: '#ef4444',
  High:     '#f97316',
  Moderate: '#eab308',
  Low:      '#22c55e',
};

/**
 * Community Map using raw Leaflet (no react-leaflet import issues)
 * Shows district hotspots with AQI color coding
 */
export default function CommunityMap({ districts = [], height = '400px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return; // already initialized

    // Dynamically load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default icon path issue with bundlers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const center = districts.length > 0
        ? [districts[0].lat, districts[0].lng]
        : [31.5204, 74.3587]; // Lahore default

      const map = L.map(mapRef.current, {
        center,
        zoom: 11,
        zoomControl: true,
        attributionControl: true,
      });

      mapInstanceRef.current = map;

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Add district markers
      districts.forEach(d => {
        const color = RISK_COLORS[d.riskLevel] || '#6366f1';
        const radius = Math.max(15, Math.min(40, d.aqi / 6));

        const circle = L.circleMarker([d.lat, d.lng], {
          radius,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.45,
        }).addTo(map);

        const trendIcon = d.trend === 'rising' ? '↑' : d.trend === 'falling' ? '↓' : '→';
        const trendColor = d.trend === 'rising' ? '#ef4444' : d.trend === 'falling' ? '#22c55e' : '#eab308';

        circle.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; min-width: 180px; color: #e2e8f0; background: #0f172a; border-radius: 12px; padding: 4px 0;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #f1f5f9;">${d.name}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px;">
              <div><span style="color:#94a3b8">AQI:</span> <span style="color:${color}; font-weight:700">${d.aqi}</span></div>
              <div><span style="color:#94a3b8">PM2.5:</span> <span style="color:#f1f5f9">${d.pm25} μg/m³</span></div>
              <div><span style="color:#94a3b8">Risk:</span> <span style="color:${color}; font-weight:600">${d.riskLevel}</span></div>
              <div><span style="color:#94a3b8">Trend:</span> <span style="color:${trendColor}; font-weight:700">${trendIcon} ${d.trend}</span></div>
              <div><span style="color:#94a3b8">Hosp:</span> <span style="color:#f1f5f9">${d.hospitalOccupancy}%</span></div>
              <div><span style="color:#94a3b8">Pop:</span> <span style="color:#f1f5f9">${(d.population/1000).toFixed(0)}K</span></div>
            </div>
          </div>
        `, {
          className: 'dark-popup',
          maxWidth: 220,
        });
      });

      // Legend
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div');
        div.style.cssText = 'background:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 14px;font-family:Inter,sans-serif;font-size:11px;color:#e2e8f0;';
        div.innerHTML = `
          <div style="font-weight:700;margin-bottom:8px;color:#f1f5f9">AQI Risk Level</div>
          ${Object.entries(RISK_COLORS).map(([level, color]) => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="width:12px;height:12px;border-radius:50%;background:${color};display:inline-block;"></span>
              <span>${level}</span>
            </div>
          `).join('')}
        `;
        return div;
      };
      legend.addTo(map);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when districts change
  useEffect(() => {
    // Re-render handled by initializing once with current districts
  }, [districts]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/5" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
        }
        .leaflet-control-attribution {
          background: rgba(15,23,42,0.8) !important;
          color: #475569 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: #64748b !important;
        }
        .leaflet-bar {
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background: #0f172a !important;
          color: #94a3b8 !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .leaflet-bar a:hover {
          background: #1e293b !important;
          color: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
}
