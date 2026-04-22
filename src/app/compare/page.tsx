'use client';

import Image from "next/image";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { buildPriceLabel, formatPrice, getDistrict } from "@/lib/property-format";
import { LISTING_TYPES, type Property } from "@/types/property";
import { useFavoritesStore } from "@/lib/favorites-store";
import Contact from "@/app/component/contact";
import BeforeFooter from "@/app/component/before_footer";
import { applyFilters, EMPTY_FILTERS, type Filters } from "@/app/component/mainpage";

const headingFont = Raleway({
  subsets: ["latin"],
  weight: ["300", "400"],
});

function formatMeters(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} กม.` : `${m} ม.`;
}

const PROXIMITY_OPTIONS = [
  { value: 500, label: "500 ม." },
  { value: 1000, label: "1 กม." },
  { value: 2000, label: "2 กม." },
  { value: 5000, label: "5 กม." },
];

function filtersFromParams(params: URLSearchParams): Filters {
  const f: Filters = { ...EMPTY_FILTERS };
  const q = params.get("q"); if (q) f.searchKeyword = q;
  const listing = params.get("listing"); if (listing) f.listingType = listing.split(",").filter(Boolean);
  const devType = params.get("devType"); if (devType) f.developmentType = devType.split(",").filter(Boolean);
  const district = params.get("district"); if (district) f.district = district.split(",").filter(Boolean);
  const highlights = params.get("highlights"); if (highlights) f.highlights = highlights.split(",").filter(Boolean);
  const beds = params.get("beds"); if (beds) f.minBedrooms = beds;
  const priceMin = params.get("priceMin"); if (priceMin) f.priceRange[0] = Number(priceMin);
  const priceMax = params.get("priceMax"); if (priceMax) f.priceRange[1] = Number(priceMax);
  const areaMin = params.get("areaMin"); if (areaMin) f.areaSize[0] = Number(areaMin);
  const areaMax = params.get("areaMax"); if (areaMax) f.areaSize[1] = Number(areaMax);
  const school = params.get("school"); if (school) f.proximitySchool = Number(school);
  const hospital = params.get("hospital"); if (hospital) f.proximityHospital = Number(hospital);
  const bts = params.get("bts"); if (bts) f.proximityBTS = Number(bts);
  const mrt = params.get("mrt"); if (mrt) f.proximityMRT = Number(mrt);
  return f;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(() => filtersFromParams(searchParams));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addFavorite, removeFavorite, isFavorite, hasHydrated } = useFavoritesStore();

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        setAllProperties(Array.isArray(data) ? data : (data.properties ?? []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const developmentTypeOptions = useMemo(
    () => Array.from(new Set(allProperties.map((p) => p.propertyType).filter(Boolean))) as string[],
    [allProperties],
  );
  const districtOptions = useMemo(
    () => Array.from(new Set(allProperties.map((p) => getDistrict(p.location)).filter(Boolean))),
    [allProperties],
  );
  const highlightOptions = useMemo(
    () => Array.from(new Set(allProperties.flatMap((p) => p.features ?? []))).sort(),
    [allProperties],
  );

  const filteredProperties = useMemo(() => applyFilters(allProperties, filters), [allProperties, filters]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (filters.searchKeyword.trim()) count += 1;
    count += filters.listingType.length + filters.developmentType.length + filters.district.length + filters.highlights.length;
    if (filters.minBedrooms) count += 1;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] > 0) count += 1;
    if (filters.areaSize[0] > 0 || filters.areaSize[1] > 0) count += 1;
    if (filters.proximitySchool !== null) count += 1;
    if (filters.proximityHospital !== null) count += 1;
    if (filters.proximityBTS !== null) count += 1;
    if (filters.proximityMRT !== null) count += 1;
    return count;
  }, [filters]);

  const handleToggleFavorite = (property: Property, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isFavorite(property.id)) removeFavorite(property.id);
    else addFavorite(property);
  };

  const handleFilterChange = (filterType: keyof Filters, value: Filters[keyof Filters]) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const toggleArrayFilter = (
    filterType: "areaType" | "listingType" | "developmentType" | "district" | "highlights",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item: string) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const clearFilters = () => setFilters({ ...EMPTY_FILTERS });

  const chipCls = (active: boolean) =>
    `rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-150 ${
      active ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "border-[#d8d2ca] bg-white text-[#555] hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
    }`;
  const inputCls = "h-9 w-full rounded border border-[#d8d2ca] bg-white px-3 text-[12px] text-[#0a0a0a] outline-none transition focus:border-[#0a0a0a] placeholder:text-[#bbb]";
  const labelCls = "mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999]";

  const [priceMin, setPriceMin] = useState(filters.priceRange[0] > 0 ? String(filters.priceRange[0]) : "");
  const [priceMax, setPriceMax] = useState(filters.priceRange[1] > 0 ? String(filters.priceRange[1]) : "");
  const [areaMin, setAreaMin] = useState(filters.areaSize[0] > 0 ? String(filters.areaSize[0]) : "");
  const [areaMax, setAreaMax] = useState(filters.areaSize[1] > 0 ? String(filters.areaSize[1]) : "");

  const commitPrice = (lo: string, hi: string) => {
    handleFilterChange("priceRange", [Math.max(0, parseInt(lo, 10) || 0), Math.max(0, parseInt(hi, 10) || 0)] as [number, number]);
  };
  const commitArea = (lo: string, hi: string) => {
    handleFilterChange("areaSize", [Math.max(0, parseInt(lo, 10) || 0), Math.max(0, parseInt(hi, 10) || 0)] as [number, number]);
  };
  const toggleProximity = (key: "proximitySchool" | "proximityHospital" | "proximityBTS" | "proximityMRT", val: number) => {
    handleFilterChange(key, filters[key] === val ? null : val);
  };

  return (
    <div className="min-h-screen bg-white">
      <CompareHero />

      <div className="container mx-auto px-4 py-12">
        {/* Header + Filter toggle */}
        <div className="mb-8 border-b border-slate-300 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className={`${headingFont.className} text-3xl font-light text-slate-900 mb-1`}>choose your best house</h1>
              <p className="text-sm text-slate-500">
                {loading ? "กำลังโหลด..." : `แสดง ${filteredProperties.length} รายการ`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen((v) => !v)}
              className="inline-flex items-center gap-2 border border-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              <span className="inline-block h-px w-4 bg-current" />
              ตัวกรอง
              {activeFilters > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] text-white">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          <div className={`overflow-hidden transition-all duration-500 ${isFilterOpen ? "mt-6 max-h-[900px] opacity-100" : "mt-0 max-h-0 opacity-0"}`}>
            <div className="border-t border-slate-200 pt-5 space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <p className={labelCls}>ประเภทประกาศ</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LISTING_TYPES.map((t) => (
                      <button key={t} type="button" onClick={() => toggleArrayFilter("listingType", t)} className={chipCls(filters.listingType.includes(t))}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className={labelCls}>ประเภทการพัฒนา</p>
                  <div className="flex flex-wrap gap-1.5">
                    {developmentTypeOptions.map((t) => (
                      <button key={t} type="button" onClick={() => toggleArrayFilter("developmentType", t)} className={chipCls(filters.developmentType.includes(t))}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className={labelCls}>ห้องนอนขั้นต่ำ</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["", "1", "2", "3", "4", "5"].map((val) => (
                      <button key={val || "any"} type="button" onClick={() => handleFilterChange("minBedrooms", val)} className={chipCls(filters.minBedrooms === val)}>
                        {val ? `${val}+` : "ทั้งหมด"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <p className={labelCls}>ราคา (บาท)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" inputMode="numeric" placeholder="ต่ำสุด" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} onBlur={() => commitPrice(priceMin, priceMax)} onKeyDown={(e) => e.key === "Enter" && commitPrice(priceMin, priceMax)} className={inputCls} />
                    <input type="text" inputMode="numeric" placeholder="สูงสุด" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} onBlur={() => commitPrice(priceMin, priceMax)} onKeyDown={(e) => e.key === "Enter" && commitPrice(priceMin, priceMax)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <p className={labelCls}>พื้นที่ (ตร.ม.)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" inputMode="numeric" placeholder="ต่ำสุด" value={areaMin} onChange={(e) => setAreaMin(e.target.value)} onBlur={() => commitArea(areaMin, areaMax)} onKeyDown={(e) => e.key === "Enter" && commitArea(areaMin, areaMax)} className={inputCls} />
                    <input type="text" inputMode="numeric" placeholder="สูงสุด" value={areaMax} onChange={(e) => setAreaMax(e.target.value)} onBlur={() => commitArea(areaMin, areaMax)} onKeyDown={(e) => e.key === "Enter" && commitArea(areaMin, areaMax)} className={inputCls} />
                  </div>
                </div>
              </div>

              {districtOptions.length > 0 && (
                <div>
                  <p className={labelCls}>เขต / อำเภอ</p>
                  <div className="flex flex-wrap gap-1.5">
                    {districtOptions.map((d) => (
                      <button key={d} type="button" onClick={() => toggleArrayFilter("district", d)} className={chipCls(filters.district.includes(d))}>{d}</button>
                    ))}
                  </div>
                </div>
              )}

              {highlightOptions.length > 0 && (
                <div>
                  <p className={labelCls}>จุดเด่น</p>
                  <div className="flex flex-wrap gap-1.5">
                    {highlightOptions.map((h) => (
                      <button key={h} type="button" onClick={() => toggleArrayFilter("highlights", h)} className={chipCls(filters.highlights.includes(h))}>{h}</button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className={labelCls}>ทำเลใกล้</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {([
                    { key: "proximitySchool" as const, label: "🏫 ใกล้โรงเรียน" },
                    { key: "proximityHospital" as const, label: "🏥 ใกล้โรงพยาบาล" },
                    { key: "proximityBTS" as const, label: "🚈 ใกล้ BTS" },
                    { key: "proximityMRT" as const, label: "🚇 ใกล้ MRT" },
                  ]).map(({ key, label }) => (
                    <div key={key}>
                      <p className="mb-1.5 text-[10px] font-medium text-[#555]">{label}</p>
                      <div className="flex flex-wrap gap-1">
                        {PROXIMITY_OPTIONS.map((opt) => (
                          <button key={opt.value} type="button" onClick={() => toggleProximity(key, opt.value)} className={chipCls(filters[key] === opt.value)}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                <button type="button" onClick={clearFilters} className="border border-slate-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:border-slate-900 hover:text-slate-900">
                  ล้างตัวกรอง
                </button>
                <button type="button" onClick={() => setIsFilterOpen(false)} className="border border-slate-900 bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-700">
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">กำลังโหลดรายการ...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500 mb-4">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
            <button onClick={clearFilters} className="border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition">
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => {
              const favorite = hasHydrated && isFavorite(property.id);
              return (
                <article key={property.id} className="border-t border-slate-300 pt-6">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <Image src={property.image} alt={property.title} fill className="object-cover" />
                    <div className="absolute left-3 top-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95)" }}>
                        {property.type}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(property, e)}
                      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border transition ${
                        favorite ? "border-red-500 bg-red-500 text-white" : "border-white/80 bg-white/20 text-white hover:bg-white hover:text-slate-900"
                      }`}
                      aria-label={favorite ? "ลบจากรายการโปรด" : "เพิ่มในรายการโปรด"}
                    >
                      <svg className="h-3.5 w-3.5" fill={favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
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
                            <span key={i} className="rounded-none bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{feature}</span>
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
              );
            })}
          </div>
        )}
      </div>

      <Contact />
      <BeforeFooter />
    </div>
  );
}

function CompareHero() {
  return (
    <section className="compare-hero">
      <div className="compare-hero__line-wrap" aria-hidden="true">
        <svg viewBox="0 0 1200 520" preserveAspectRatio="none" className="compare-hero__lines">
          <path className="compare-hero__line compare-hero__line--a" d="M0 500 L180 430 L180 330" />
          <path className="compare-hero__line compare-hero__line--b" d="M520 330 L830 220 L830 490" />
          <path className="compare-hero__line compare-hero__line--c" d="M830 220 L1200 70" />
          <path className="compare-hero__line compare-hero__line--d" d="M1080 500 L1080 360 L1200 300" />
        </svg>
      </div>
      <p className="compare-hero__kicker">✦ THE BELIEFS THAT SHAPE US</p>
      <div className="compare-hero__center">
        <h2 className={`${headingFont.className} compare-hero__title`}>
          <span className="compare-hero__title-line">It&apos;s</span>
          <span className="compare-hero__title-line">your</span>
          <span className="compare-hero__title-line">choice</span>
        </h2>
      </div>
      <span className="compare-hero__tag compare-hero__tag--1">THE TRUST YOU DESERVE</span>
      <span className="compare-hero__tag compare-hero__tag--2">THE HOME YOU LOVE</span>
      <span className="compare-hero__tag compare-hero__tag--3">THE DECISION YOU OWN</span>
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
