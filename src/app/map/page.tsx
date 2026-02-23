'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Import Leaflet dynamically to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Custom House Icon
const houseIcon = L.divIcon({
  className: 'custom-house-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; bottom: 0; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 12px solid #2563eb;"></div>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="#2563eb" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
});

export default function MapPage() {
  const searchParams = useSearchParams();
  
  const lat = parseFloat(searchParams.get('lat') || '13.7563');
  const lng = parseFloat(searchParams.get('lng') || '100.5018');
  const title = searchParams.get('title') || 'ทรัพย์สิน';

  return (
    <div className="h-screen w-full relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">พิกัด: {lat.toFixed(6)}, {lng.toFixed(6)}</p>
          </div>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-gray-700 font-medium"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="h-full pt-20">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={houseIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-600">
                  พิกัด: {lat.toFixed(6)}, {lng.toFixed(6)}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                >
                  เปิดใน Google Maps →
                </a>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[1000]">
        <h3 className="font-semibold text-gray-900 mb-2">ข้อมูลตำแหน่ง</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-gray-700">Latitude: {lat.toFixed(6)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-gray-700">Longitude: {lng.toFixed(6)}</span>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          เปิดใน Google Maps
        </a>
      </div>
    </div>
  );
}
