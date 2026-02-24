'use client';

import dynamic from "next/dynamic";
import L from "leaflet";
import { useSearchParams } from "next/navigation";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false },
);

const houseIcon = L.divIcon({
  className: "custom-house-marker",
  html: `
    <div class="map-house-pin">
      <span class="map-house-pin__pulse"></span>
      <span class="map-house-pin__core">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 11.5L12 4l8 7.5v7a1.5 1.5 0 0 1-1.5 1.5h-3.2v-5.2a1.1 1.1 0 0 0-1.1-1.1h-2.4a1.1 1.1 0 0 0-1.1 1.1V20H7.5A1.5 1.5 0 0 1 6 18.5v-7z" />
        </svg>
      </span>
    </div>
  `,
  iconSize: [56, 56],
  iconAnchor: [28, 56],
  popupAnchor: [0, -50],
});

export default function MapPage() {
  const searchParams = useSearchParams();

  const parsedLat = parseFloat(searchParams.get("lat") || "13.7563");
  const parsedLng = parseFloat(searchParams.get("lng") || "100.5018");
  const lat = Number.isFinite(parsedLat) ? parsedLat : 13.7563;
  const lng = Number.isFinite(parsedLng) ? parsedLng : 100.5018;

  const title = searchParams.get("title") || "โครงการที่เลือก";
  const location = searchParams.get("location") || "ทำเลศักยภาพ เดินทางสะดวก";
  const image = searchParams.get("image") || "";
  const listingType = searchParams.get("listingType") || "";
  const propertyType = searchParams.get("propertyType") || "";
  const priceLabel = searchParams.get("priceLabel") || "สอบถามราคา";

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const handleClose = () => {
    if (window.opener) {
      window.close();
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(191,219,254,0.56),rgba(226,232,240,0.88)_48%,rgba(241,245,249,1)_100%)]">
      <div className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-14 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

      <header className="absolute left-1/2 top-5 z-[1100] w-[calc(100%-1.25rem)] max-w-3xl -translate-x-1/2 rounded-full border border-white/70 bg-white/72 px-3 py-1.5 shadow-[0_20px_48px_-30px_rgba(15,23,42,0.72)] backdrop-blur-xl animate-[property-modal-in_0.35s_cubic-bezier(0.22,1,0.36,1)_both] md:px-4 md:py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 pl-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Map View</p>
            <h1 className="line-clamp-1 text-sm font-semibold text-slate-900 md:text-base">{title}</h1>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-8 items-center rounded-full bg-white/85 px-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-white md:h-9 md:px-3.5"
            >
              ปิด
            </button>
          </div>
        </div>
      </header>

      <div className="h-full p-1.5 md:p-2">
        <div className="sknat-map-canvas relative h-full overflow-hidden rounded-[1.5rem] border border-white/65 shadow-[0_35px_80px_-36px_rgba(15,23,42,0.65)]">
          <div className="pointer-events-none absolute inset-0 z-[450] bg-gradient-to-b from-slate-950/8 via-transparent to-slate-950/14" />

          <div className="h-full w-full animate-[property-modal-backdrop-in_0.35s_ease-out_both]">
            <MapContainer center={[lat, lng]} zoom={15} className="h-full w-full" scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              <Marker position={[lat, lng]} icon={houseIcon}>
                <Popup className="sknat-map-popup" minWidth={260}>
                  <article className="overflow-hidden rounded-xl bg-white/98">
                    {image ? (
                      <div
                        className="h-28 w-full bg-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                    ) : null}

                    <div className="space-y-2 p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {listingType ? <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">{listingType}</span> : null}
                        {propertyType ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{propertyType}</span> : null}
                      </div>

                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{title}</h3>
                      <p className="line-clamp-2 text-xs text-slate-600">{location}</p>
                      <p className="text-sm font-semibold text-blue-700">{priceLabel}</p>
                    </div>
                  </article>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] w-[calc(100%-2rem)] max-w-sm rounded-[1.2rem] border border-white/75 bg-white/80 p-3 shadow-[0_24px_52px_-30px_rgba(15,23,42,0.72)] backdrop-blur-xl animate-[property-modal-in_0.4s_cubic-bezier(0.22,1,0.36,1)_both] md:bottom-6 md:left-6 md:p-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Property Spotlight</p>
        <h3 className="mt-1 line-clamp-1 text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-slate-600">{location}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {listingType ? <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">{listingType}</span> : null}
          {propertyType ? <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">{propertyType}</span> : null}
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{priceLabel}</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          เปิดเส้นทางใน Google Maps
        </a>
      </div>
    </div>
  );
}
