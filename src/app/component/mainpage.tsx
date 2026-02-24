'use client';

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type WheelEvent } from "react";

import { buildPriceLabel, formatPrice, getDistrict } from "@/lib/property-format";
import { LISTING_TYPES, type Property } from "@/types/property";

import PropertyModal from "./PropertyModal";

type MainPageProps = {
  properties: Property[];
};

type Filters = {
  searchKeyword: string;
  areaType: string[];
  listingType: string[];
  developmentType: string[];
  priceRange: [number, number];
  areaSize: [number, number];
  minBedrooms: string;
  district: string[];
};

type FilterControlsProps = {
  filters: Filters;
  areaTypeOptions: string[];
  developmentTypeOptions: string[];
  districtOptions: string[];
  handleFilterChange: (filterType: keyof Filters, value: Filters[keyof Filters]) => void;
  toggleArrayFilter: (filterType: "areaType" | "listingType" | "developmentType" | "district", value: string) => void;
  clearFilters: () => void;
};

const DEFAULT_MAX_PRICE = 50000000;
const DEFAULT_MAX_AREA = 500;

export default function MainPage({ properties }: MainPageProps) {
  const [filters, setFilters] = useState<Filters>({
    searchKeyword: "",
    areaType: [],
    listingType: [],
    developmentType: [],
    priceRange: [0, DEFAULT_MAX_PRICE],
    areaSize: [0, DEFAULT_MAX_AREA],
    minBedrooms: "",
    district: [],
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterWide, setIsFilterWide] = useState(false);
  const filterCloseTimerRef = useRef<number | null>(null);
  const propertySliderRef = useRef<HTMLDivElement | null>(null);
  const sliderAutoDirectionRef = useRef<1 | -1>(1);
  const sliderAutoPauseUntilRef = useRef(0);

  const areaTypeOptions = useMemo(
    () => Array.from(new Set(properties.map((property) => property.category).filter(Boolean))) as string[],
    [properties],
  );

  const developmentTypeOptions = useMemo(
    () => Array.from(new Set(properties.map((property) => property.propertyType).filter(Boolean))) as string[],
    [properties],
  );

  const districtOptions = useMemo(
    () => Array.from(new Set(properties.map((property) => getDistrict(property.location)).filter(Boolean))),
    [properties],
  );

  const openPropertyModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closePropertyModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProperty(null), 300);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (
        filters.searchKeyword &&
        !property.title.toLowerCase().includes(filters.searchKeyword.toLowerCase()) &&
        !property.location.toLowerCase().includes(filters.searchKeyword.toLowerCase())
      ) {
        return false;
      }

      if (filters.areaType.length > 0 && !filters.areaType.includes(property.category ?? "")) {
        return false;
      }

      if (filters.listingType.length > 0 && !filters.listingType.includes(property.type)) {
        return false;
      }

      if (filters.developmentType.length > 0 && !filters.developmentType.includes(property.propertyType ?? "")) {
        return false;
      }

      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      if (property.size !== undefined) {
        if (property.size < filters.areaSize[0] || property.size > filters.areaSize[1]) {
          return false;
        }
      }

      if (filters.minBedrooms) {
        const bedrooms = property.bedrooms ?? 0;
        if (bedrooms < parseInt(filters.minBedrooms, 10)) {
          return false;
        }
      }

      if (filters.district.length > 0) {
        const propertyDistrict = getDistrict(property.location);
        if (!filters.district.includes(propertyDistrict)) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (filters.searchKeyword.trim()) count += 1;
    count += filters.areaType.length;
    count += filters.listingType.length;
    count += filters.developmentType.length;
    count += filters.district.length;
    if (filters.minBedrooms) count += 1;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < DEFAULT_MAX_PRICE) count += 1;
    if (filters.areaSize[0] > 0 || filters.areaSize[1] < DEFAULT_MAX_AREA) count += 1;
    return count;
  }, [filters]);

  const handleFilterChange = (filterType: keyof Filters, value: Filters[keyof Filters]) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const toggleArrayFilter = (
    filterType: "areaType" | "listingType" | "developmentType" | "district",
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchKeyword: "",
      areaType: [],
      listingType: [],
      developmentType: [],
      priceRange: [0, DEFAULT_MAX_PRICE],
      areaSize: [0, DEFAULT_MAX_AREA],
      minBedrooms: "",
      district: [],
    });
  };

  const handlePropertySliderWheel = (event: WheelEvent<HTMLDivElement>) => {
    const slider = propertySliderRef.current;
    if (!slider) return;

    sliderAutoPauseUntilRef.current = Date.now() + 2400;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    if (maxScrollLeft <= 0) return;

    const canScrollRight = event.deltaY > 0 && slider.scrollLeft < maxScrollLeft - 1;
    const canScrollLeft = event.deltaY < 0 && slider.scrollLeft > 1;
    if (!canScrollRight && !canScrollLeft) return;

    event.preventDefault();
    const next = Math.max(0, Math.min(slider.scrollLeft + event.deltaY, maxScrollLeft));
    slider.scrollTo({ left: next, behavior: "auto" });
  };

  const handlePropertySliderPointerDown = () => {
    sliderAutoPauseUntilRef.current = Date.now() + 2600;
  };

  const openFilterPanel = () => {
    if (filterCloseTimerRef.current) {
      window.clearTimeout(filterCloseTimerRef.current);
      filterCloseTimerRef.current = null;
    }
    setIsFilterOpen(true);
    requestAnimationFrame(() => setIsFilterVisible(true));
  };

  const closeFilterPanel = () => {
    setIsFilterVisible(false);
    if (filterCloseTimerRef.current) {
      window.clearTimeout(filterCloseTimerRef.current);
    }
    filterCloseTimerRef.current = window.setTimeout(() => {
      setIsFilterOpen(false);
      filterCloseTimerRef.current = null;
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (filterCloseTimerRef.current) {
        window.clearTimeout(filterCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    sliderAutoDirectionRef.current = 1;
    sliderAutoPauseUntilRef.current = Date.now() + 900;

    const timer = window.setInterval(() => {
      const slider = propertySliderRef.current;
      if (!slider) return;
      if (Date.now() < sliderAutoPauseUntilRef.current) return;

      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      if (maxScrollLeft <= 0) return;

      let next = slider.scrollLeft + sliderAutoDirectionRef.current * 1.2;
      if (next >= maxScrollLeft) {
        next = maxScrollLeft;
        sliderAutoDirectionRef.current = -1;
        sliderAutoPauseUntilRef.current = Date.now() + 800;
      } else if (next <= 0) {
        next = 0;
        sliderAutoDirectionRef.current = 1;
        sliderAutoPauseUntilRef.current = Date.now() + 800;
      }

      slider.scrollLeft = next;
    }, 16);

    return () => {
      window.clearInterval(timer);
    };
  }, [filteredProperties.length]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e7edf4_0%,#dce6f1_42%,#eaf0f5_100%)] text-slate-900">
      <section id="properties" className="relative overflow-hidden py-16 md:py-20">
        <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-28 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_100%)]" />

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">SKNAT VILLA CURATION</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">เลือกบ้านสไตล์หรูแบบพูลวิลล่า</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">ประสบการณ์ค้นหาบ้านที่ลื่นไหล โปร่งสบาย และคัดทรัพย์แบบร่วมสมัย</p>
            </div>

            <div className="flex items-end gap-7">
              <CounterCard label="ผลลัพธ์" value={`${filteredProperties.length}`} />
              <CounterCard label="ตัวกรองที่ใช้" value={`${activeFilters}`} />
            </div>
          </div>

          <div className="mb-7 flex flex-col gap-3 rounded-[2rem] bg-white/58 p-3 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.75)] backdrop-blur-xl md:flex-row md:items-center md:p-4">
            <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-white/80 px-4 ring-1 ring-white/70">
              <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="ค้นหาโครงการ, พื้นที่, จังหวัด"
                value={filters.searchKeyword}
                onChange={(event) => handleFilterChange("searchKeyword", event.target.value)}
                className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="button"
              onClick={openFilterPanel}
              className="h-12 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              ตัวกรองขั้นสูง ({activeFilters})
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="h-12 rounded-full bg-white/80 px-5 text-sm font-semibold text-slate-700 transition hover:bg-white"
            >
              รีเซ็ต
            </button>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="rounded-[2rem] bg-white/72 p-12 text-center shadow-[0_24px_60px_-36px_rgba(15,23,42,0.55)] backdrop-blur-lg">
              <h3 className="text-xl font-semibold text-slate-900">ไม่พบอสังหาริมทรัพย์ตามเงื่อนไข</h3>
              <p className="mt-2 text-slate-600">ลองปรับช่วงราคา ประเภท หรือเขตใหม่</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                ล้างตัวกรอง
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <span>Property Slider</span>
                <span>เลื่อนแนวนอนเพื่อดูต่อ</span>
              </div>
              <div
                ref={propertySliderRef}
                onWheel={handlePropertySliderWheel}
                onPointerDown={handlePropertySliderPointerDown}
                className="flex snap-x snap-mandatory gap-7 overflow-x-auto pb-4 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
              {filteredProperties.map((property) => (
                <article
                  key={property.id}
                  className="group w-[min(88vw,690px)] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-white/78 shadow-[0_26px_55px_-34px_rgba(15,23,42,0.62)] backdrop-blur-sm transition duration-400 hover:-translate-y-1.5 md:w-[min(72vw,700px)] 2xl:w-[min(60vw,760px)]"
                >
                  <div className="relative h-64 overflow-hidden md:h-72">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/75 via-[#020617]/15 to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-900">{property.type}</span>
                      {property.propertyType ? (
                        <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white">{property.propertyType}</span>
                      ) : null}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                      <p className="line-clamp-1 text-xs text-white/85">{property.location}</p>
                      <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-white">{property.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                      {property.size ? <MetricTag label={`${property.size} ตร.ม.`} /> : null}
                      {property.bedrooms ? <MetricTag label={`${property.bedrooms} ห้องนอน`} /> : null}
                      {property.bathrooms ? <MetricTag label={`${property.bathrooms} ห้องน้ำ`} /> : null}
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-3xl font-semibold tracking-tight text-slate-950">{buildPriceLabel(property)}</p>
                        {property.pricePerSqm ? (
                          <p className="text-xs text-slate-500">{formatPrice(property.pricePerSqm)}/ตร.ม.</p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => openPropertyModal(property)}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        รายละเอียด
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {isFilterOpen ? (
        <div
          className={`fixed inset-0 z-[80] backdrop-blur-[3px] transition-[background-color,opacity] duration-300 ${
            isFilterVisible ? "bg-slate-950/42 opacity-100" : "bg-slate-950/0 opacity-0"
          }`}
        >
          <button type="button" onClick={closeFilterPanel} className="absolute inset-0" aria-label="ปิดฟิลเตอร์" />

          <aside
            className={`absolute bottom-4 left-3 top-4 overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(160deg,rgba(247,250,255,0.95)_0%,rgba(227,236,246,0.92)_100%)] p-4 shadow-[20px_0_80px_-25px_rgba(15,23,42,0.72)] transition-[transform,opacity,width,max-width] duration-300 ease-out md:p-5 ${
              isFilterWide ? "w-[calc(100%-1.5rem)] max-w-[460px]" : "w-[calc(100%-1.5rem)] max-w-[360px]"
            } ${
              isFilterVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="mb-3 rounded-2xl bg-white/55 p-3 ring-1 ring-white/70 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">Advanced Filters</h3>
                  <p className="mt-1 text-xs text-slate-500">ปรับเงื่อนไขเพื่อคัดบ้านที่ใกล้เคียงความต้องการ</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFilterWide((prev) => !prev)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    {isFilterWide ? "ย่อ" : "ขยาย"}
                  </button>
                  <button
                    type="button"
                    onClick={closeFilterPanel}
                    className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-[calc(100vh-185px)] overflow-y-auto pr-1">
              <FilterControls
                filters={filters}
                areaTypeOptions={areaTypeOptions}
                developmentTypeOptions={developmentTypeOptions}
                districtOptions={districtOptions}
                handleFilterChange={handleFilterChange}
                toggleArrayFilter={toggleArrayFilter}
                clearFilters={clearFilters}
              />
            </div>
          </aside>
        </div>
      ) : null}

      {selectedProperty ? (
        <PropertyModal
          key={selectedProperty.id}
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={closePropertyModal}
        />
      ) : null}
    </div>
  );
}

function FilterControls({
  filters,
  areaTypeOptions,
  developmentTypeOptions,
  districtOptions,
  handleFilterChange,
  toggleArrayFilter,
  clearFilters,
}: FilterControlsProps) {
  return (
    <div className="space-y-3 pb-4">
      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">คำค้นหา</label>
        <input
          type="text"
          placeholder="บ้านเดี่ยว, คอนโด, ที่ดิน"
          value={filters.searchKeyword}
          onChange={(event) => handleFilterChange("searchKeyword", event.target.value)}
          className="h-11 w-full rounded-2xl bg-white px-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition focus:ring-slate-900"
        />
      </div>

      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">พื้นที่</p>
        <div className="flex flex-wrap gap-2">
          {areaTypeOptions.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleArrayFilter("areaType", type)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                filters.areaType.includes(type)
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">ประเภทประกาศ</p>
        <div className="grid grid-cols-2 gap-2">
          {LISTING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleArrayFilter("listingType", type)}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                filters.listingType.includes(type)
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">ประเภทการพัฒนา</p>
        <div className="grid grid-cols-2 gap-2">
          {developmentTypeOptions.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleArrayFilter("developmentType", type)}
              className={`rounded-2xl px-2.5 py-2 text-left text-xs transition ${
                filters.developmentType.includes(type)
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          ราคา {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
        </label>
        <input
          type="range"
          min="0"
          max={DEFAULT_MAX_PRICE}
          step="100000"
          value={filters.priceRange[1]}
          onChange={(event) =>
            handleFilterChange("priceRange", [filters.priceRange[0], parseInt(event.target.value, 10)])
          }
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-slate-900"
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="ต่ำสุด"
            value={filters.priceRange[0]}
            onChange={(event) =>
              handleFilterChange("priceRange", [parseInt(event.target.value, 10) || 0, filters.priceRange[1]])
            }
            className="h-10 w-full rounded-2xl bg-white px-2.5 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition focus:ring-slate-900"
          />
          <input
            type="number"
            placeholder="สูงสุด"
            value={filters.priceRange[1]}
            onChange={(event) =>
              handleFilterChange("priceRange", [
                filters.priceRange[0],
                parseInt(event.target.value, 10) || DEFAULT_MAX_PRICE,
              ])
            }
            className="h-10 w-full rounded-2xl bg-white px-2.5 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition focus:ring-slate-900"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          พื้นที่ {filters.areaSize[0]} - {filters.areaSize[1]} ตร.ม.
        </label>
        <input
          type="range"
          min="0"
          max={DEFAULT_MAX_AREA}
          step="10"
          value={filters.areaSize[1]}
          onChange={(event) =>
            handleFilterChange("areaSize", [filters.areaSize[0], parseInt(event.target.value, 10)])
          }
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-slate-900"
        />
      </div>

      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">ห้องนอนขั้นต่ำ</label>
        <select
          value={filters.minBedrooms}
          onChange={(event) => handleFilterChange("minBedrooms", event.target.value)}
          className="h-10 w-full rounded-2xl bg-white px-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition focus:ring-slate-900"
        >
          <option value="">ไม่ระบุ</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      <div className="rounded-2xl bg-white/58 p-3 ring-1 ring-white/75 backdrop-blur-sm">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">เขต/อำเภอ</p>
        <div className="max-h-36 space-y-1 overflow-auto rounded-2xl bg-white p-2 ring-1 ring-slate-200">
          {districtOptions.map((district) => (
            <button
              key={district}
              type="button"
              onClick={() => toggleArrayFilter("district", district)}
              className={`block w-full rounded-xl px-2 py-1.5 text-left text-sm transition ${
                filters.district.includes(district)
                  ? "bg-slate-950 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(2,6,23,0.9)] transition hover:bg-slate-800"
      >
        ล้างตัวกรองทั้งหมด
      </button>
    </div>
  );
}

type CounterCardProps = {
  label: string;
  value: string;
};

function CounterCard({ label, value }: CounterCardProps) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-[2.05rem] leading-none font-semibold text-slate-950">{value}</p>
    </div>
  );
}

type MetricTagProps = {
  label: string;
};

function MetricTag({ label }: MetricTagProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
      {label}
    </span>
  );
}
