'use client';

import Image from "next/image";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useFavoritesStore } from "@/lib/favorites-store";
import { buildPriceLabel, formatPrice } from "@/lib/property-format";
import Contact from "@/app/component/contact";
import BeforeFooter from "@/app/component/before_footer";

const headingFont = Raleway({
  subsets: ["latin"],
  weight: ["300", "400"],
});

function formatMeters(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} กม.` : `${m} ม.`;
}

export default function FavoritePage() {
  const { favorites, removeFavorite } = useFavoritesStore();

  return (
    <div className="min-h-screen bg-white">
      <FavoriteHero />

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="mb-6">
            <svg className="h-20 w-20 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className={`${headingFont.className} text-2xl font-light text-slate-900 mb-3`}>ยังไม่มีบ้านที่ถูกใจ</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-center text-sm">
            กดไอคอนหัวใจที่รายการบ้านเพื่อบันทึกบ้านที่คุณชื่นชอบไว้ที่นี่
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปหน้าหลัก
          </Link>
        </div>
      ) : (

        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 border-b border-slate-300 pb-6">
            <h2 className={`${headingFont.className} text-3xl font-light text-slate-900 mb-1`}>homes you love</h2>
            <p className="text-sm text-slate-500">{favorites.length} รายการที่คุณถูกใจ</p>
          </div>
          <div className="grid gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((property) => (
              <article key={property.id} className="border-t border-slate-300 pt-6">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image src={property.image} alt={property.title} fill className="object-cover" />
                  <button
                    onClick={() => removeFavorite(property.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-red-400 bg-red-500 text-white transition hover:bg-red-600"
                    aria-label="ลบออกจากรายการโปรด"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <div className="absolute left-3 top-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95)" }}>
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 pt-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">{property.title}</h2>
                    <p className="text-sm text-slate-600">{property.location}</p>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs text-slate-500 mb-1">ราคา</p>
                    <p className="text-2xl font-bold text-slate-900">{buildPriceLabel(property)}</p>
                    {property.pricePerSqm && (
                      <p className="text-xs text-slate-500 mt-1">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                    )}
                  </div>

                  <div className="space-y-2 border-t border-slate-200 pt-4">
                    <DetailRow label="ประเภท" value={property.propertyType || '-'} />
                    <DetailRow label="พื้นที่" value={property.size ? `${property.size} ตร.ม.` : '-'} />
                    <DetailRow label="ห้องนอน" value={property.bedrooms ? `${property.bedrooms} ห้อง` : '-'} />
                    <DetailRow label="ห้องน้ำ" value={property.bathrooms ? `${property.bathrooms} ห้อง` : '-'} />
                  </div>

                  {/* Nearby facilities */}
                  {(property.nearbySchoolMeters != null || property.nearbyHospitalMeters != null || property.nearbyBTSMeters != null || property.nearbyMRTMeters != null) && (
                    <div className="border-t border-slate-200 pt-4 space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 mb-2">สิ่งอำนวยความสะดวกใกล้เคียง</p>
                      {property.nearbySchoolMeters != null && <DetailRow label="🏫 โรงเรียน" value={formatMeters(property.nearbySchoolMeters)} />}
                      {property.nearbyHospitalMeters != null && <DetailRow label="🏥 โรงพยาบาล" value={formatMeters(property.nearbyHospitalMeters)} />}
                      {property.nearbyBTSMeters != null && <DetailRow label="🚈 BTS" value={formatMeters(property.nearbyBTSMeters)} />}
                      {property.nearbyMRTMeters != null && <DetailRow label="🚇 MRT" value={formatMeters(property.nearbyMRTMeters)} />}
                    </div>
                  )}

                  {/* Features */}
                  {property.features && property.features.length > 0 && (
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-slate-500 mb-2">จุดเด่น</p>
                      <div className="flex flex-wrap gap-1.5">
                        {property.features.map((feature, i) => (
                          <span key={i} className="bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{feature}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/property/${property.id}`}
                    className="flex w-full items-center justify-center gap-2 bg-[#0a0a0a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
                  >
                    ดูรายละเอียดเพิ่มเติม
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <Contact />
      <BeforeFooter />
    </div>
  );
}

function FavoriteHero() {
  return (
    <section className="compare-hero">
      <div className="compare-hero__line-wrap" aria-hidden="true">
        <svg viewBox="0 0 1200 520" preserveAspectRatio="none" className="compare-hero__lines">
          <path className="compare-hero__line compare-hero__line--a" d="M0 80 L320 200 L320 520" />
          <path className="compare-hero__line compare-hero__line--b" d="M320 200 L680 340 L1200 180" />
          <path className="compare-hero__line compare-hero__line--c" d="M900 0 L900 160 L1200 280" />
          <path className="compare-hero__line compare-hero__line--d" d="M0 420 L200 360 L480 520" />
        </svg>
      </div>
      <p className="compare-hero__kicker">✦ THE HOMES THAT MOVE YOU</p>
      <div className="compare-hero__center">
        <h2 className={`${headingFont.className} compare-hero__title`}>
          <span className="compare-hero__title-line">The</span>
          <span className="compare-hero__title-line">homes</span>
          <span className="compare-hero__title-line">you love</span>
        </h2>
      </div>
      <span className="compare-hero__tag compare-hero__tag--1">THE LIFE YOU IMAGINE</span>
      <span className="compare-hero__tag compare-hero__tag--2">THE SPACE YOU DESERVE</span>
      <span className="compare-hero__tag compare-hero__tag--3">THE FUTURE YOU BUILD</span>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
