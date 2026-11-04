import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Compass, ShieldCheck } from 'lucide-react';

export default function InteractiveOrderMap({ stepIndex = 3, technicianName = 'Ilham Sersa' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const techMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  // Titik awal & tujuan contoh (di area Jakarta Selatan / Depok)
  const homeCoords = [-6.3215, 106.7975]; // Rumah Pelanggan
  const initialTechCoords = [-6.3385, 106.7795]; // Titik Teknisi awal

  // Rute perjalanan bertahap (waypoints)
  const waypoints = [
    [-6.3385, 106.7795],
    [-6.3340, 106.7830],
    [-6.3300, 106.7870],
    [-6.3265, 106.7915],
    [-6.3240, 106.7945],
    [-6.3215, 106.7975],
  ];

  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(1);
  const [currentCoords, setCurrentCoords] = useState(waypoints[1]);
  const [distanceKm, setDistanceKm] = useState(1.8);
  const [speedKmh, setSpeedKmh] = useState(32);

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Custom Icon Rumah
    const homeIcon = L.divIcon({
      className: 'custom-home-icon',
      html: `
        <div style="background-color: #0c1b33; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Custom Icon Teknisi (Motor & Wrench)
    const techIcon = L.divIcon({
      className: 'custom-tech-icon',
      html: `
        <div style="position: relative;">
          <div style="background-color: #ff7f11; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(255,127,17,0.5); border: 3px solid white; animation: pulse 2s infinite;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </div>
          <div style="position: absolute; -top: 4px; -right: 4px; width: 12px; height: 12px; background-color: #10b981; border: 2px solid white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Inisialisasi Map
    const map = L.map(mapContainerRef.current, {
      center: currentCoords,
      zoom: 14,
      zoomControl: false,
    });

    // Tile Layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control di pojok kanan bawah
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Garis Rute (Polyline)
    const polyline = L.polyline(waypoints, {
      color: '#ff7f11',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8',
    }).addTo(map);
    routeLineRef.current = polyline;

    // Marker Rumah
    L.marker(homeCoords, { icon: homeIcon })
      .addTo(map)
      .bindPopup('<b>Lokasi Anda</b><br/>Tujuan Perbaikan Rumah');

    // Marker Teknisi
    const techMarker = L.marker(currentCoords, { icon: techIcon })
      .addTo(map)
      .bindPopup(`<b>Teknisi: ${technicianName}</b><br/>Sedang dalam perjalanan`);
    techMarkerRef.current = techMarker;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Animasi pergerakan titik teknisi secara bertahap menuju rumah
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWaypointIdx((prev) => {
        const nextIdx = (prev + 1) % waypoints.length;
        const newCoords = waypoints[nextIdx];
        setCurrentCoords(newCoords);

        // Update posisi marker di Leaflet map
        if (techMarkerRef.current) {
          techMarkerRef.current.setLatLng(newCoords);
        }

        // Hitung perkiraan sisa jarak
        const remainingSteps = waypoints.length - 1 - nextIdx;
        const remainingDist = Math.max(0.2, (remainingSteps * 0.4)).toFixed(1);
        setDistanceKm(remainingDist);

        // Sedikit variasi kecepatan
        setSpeedKmh(Math.floor(25 + Math.random() * 15));

        return nextIdx;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Tombol Recenter ke posisi Teknisi
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(currentCoords, 15, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-slate-100">
      {/* Container Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating HUD: Kordinat & Live Telemetry Teknisi */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-black/10 flex flex-col gap-1 max-w-xs text-xs">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
          <div className="flex items-center gap-1.5 font-extrabold text-[#0c1b33]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live GPS Teknisi</span>
          </div>
          <span className="text-[10px] bg-orange-100 text-[#ff7f11] font-bold px-2 py-0.5 rounded-full">
            {stepIndex >= 4 ? 'Tiba di Lokasi' : 'Menuju Lokasi'}
          </span>
        </div>

        <div className="text-[11px] text-gray-600 flex flex-col gap-0.5 mt-0.5">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-gray-400">Kordinat:</span>
            <span className="font-bold text-[#0c1b33]">
              {currentCoords[0].toFixed(4)}, {currentCoords[1].toFixed(4)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Jarak ke rumah:</span>
            <span className="font-extrabold text-[#ff7f11]">{distanceKm} km lagi</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Kecepatan berkendara:</span>
            <span className="font-semibold text-gray-700">{speedKmh} km/jam</span>
          </div>
        </div>
      </div>

      {/* Button Recenter Map */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute bottom-3 left-3 z-10 bg-white hover:bg-gray-50 text-[#0c1b33] px-3 py-1.5 rounded-xl shadow-md border border-black/10 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
        title="Pusatkan peta ke teknisi"
      >
        <Compass className="w-4 h-4 text-[#ff7f11] animate-spin [animation-duration:8s]" />
        <span>Pusatkan ke Teknisi</span>
      </button>

      {/* Map Interactive Hint Badge */}
      <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full hidden sm:flex items-center gap-1 pointer-events-none">
        <Navigation className="w-3 h-3 text-[#ffde59]" />
        <span>Peta Interaktif (Bisa Digeser & Zoom)</span>
      </div>
    </div>
  );
}
