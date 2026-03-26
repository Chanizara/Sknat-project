'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { buildPriceLabel, formatPrice, getDistrict } from "@/lib/property-format";
import { LISTING_TYPES, type Property } from "@/types/property";
import { useFavoritesStore } from "@/lib/favorites-store";
import About from "./about";
import OurExperience from "./OurExperience";
import ParallaxImageSection from "./ParallaxImageSection";

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
  developmentTypeOptions: string[];
  districtOptions: string[];
  handleFilterChange: (filterType: keyof Filters, value: Filters[keyof Filters]) => void;
  toggleArrayFilter: (filterType: "areaType" | "listingType" | "developmentType" | "district", value: string) => void;
};

const DEFAULT_MAX_PRICE = 50000000;
const DEFAULT_MAX_AREA = 500;

export default function MainPage({ properties }: MainPageProps) {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const [transitioningProperty, setTransitioningProperty] = useState<Property | null>(null);

  const handleToggleFavorite = (property: Property, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      const success = addFavorite(property);
      if (!success && !isFavorite(property.id)) {
        alert('คุณสามารถเลือกได้สูงสุด 3 บ้านเท่านั้น เพื่อนำไป Compare กัน');
      }
    }
  };

  const developmentTypeOptions = useMemo(
    () => Array.from(new Set(properties.map((p) => p.propertyType).filter(Boolean))) as string[],
    [properties],
  );

  const districtOptions = useMemo(
    () => Array.from(new Set(properties.map((p) => getDistrict(p.location)).filter(Boolean))),
    [properties],
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (
        filters.searchKeyword &&
        !property.title.toLowerCase().includes(filters.searchKeyword.toLowerCase()) &&
        !property.location.toLowerCase().includes(filters.searchKeyword.toLowerCase())
      ) return false;
      if (filters.areaType.length > 0 && !filters.areaType.includes(property.category ?? "")) return false;
      if (filters.listingType.length > 0 && !filters.listingType.includes(property.type)) return false;
      if (filters.developmentType.length > 0 && !filters.developmentType.includes(property.propertyType ?? "")) return false;
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false;
      if (property.size !== undefined) {
        if (property.size < filters.areaSize[0] || property.size > filters.areaSize[1]) return false;
      }
      if (filters.minBedrooms) {
        const bedrooms = property.bedrooms ?? 0;
        if (bedrooms < parseInt(filters.minBedrooms, 10)) return false;
      }
      if (filters.district.length > 0) {
        const propertyDistrict = getDistrict(property.location);
        if (!filters.district.includes(propertyDistrict)) return false;
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
    setFilters((prev) => ({ ...prev, [filterType]: value }));
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

  const handlePropertyNavigate = (property: Property, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setTransitioningProperty(property);

    window.setTimeout(() => {
      router.push(`/property/${property.id}`);
    }, 520);
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      <AnimatePresence>
        {transitioningProperty ? (
          <motion.div
            className="fixed inset-0 z-[120] bg-white"
            initial={{ y: "100%", scale: 0.92, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
            animate={{ y: 0, scale: 1, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white px-6 py-10">
              <motion.div
                initial={{ y: 120, opacity: 0.45, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
                className="grid w-full max-w-[1380px] items-center gap-10 lg:grid-cols-[0.44fr_0.56fr]"
              >
                <div className="relative aspect-[0.9] overflow-hidden bg-[#ede7df]">
                  <Image
                    src={transitioningProperty.image}
                    alt={transitioningProperty.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2d2d2d]">
                    Opening Project
                  </p>
                  <h2 className="text-[clamp(2.8rem,5vw,5.6rem)] font-light leading-[0.92] tracking-[-0.05em] text-[#111]">
                    {transitioningProperty.title}
                  </h2>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#8f8881]">
                    {transitioningProperty.location}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <About />
      <OurExperience />
      <ParallaxImageSection />

      <section id="properties" className="relative bg-white py-16 md:py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-[#e8e8e8]" />

        <div className="relative mx-auto max-w-[1720px] px-3 md:px-5">
          <div className="relative bg-white">
            <div className="relative">
              {/* Empty state */}
              {filteredProperties.length === 0 ? (
                <div className="rounded-[30px] border border-[#ececec] bg-white p-12 text-center shadow-[0_20px_60px_-52px_rgba(15,23,42,0.18)]">
                  <h3 className="text-xl font-semibold text-[#0a0a0a]">ไม่พบอสังหาริมทรัพย์ตามเงื่อนไข</h3>
                  <p className="mt-2 text-[#666]">ลองปรับช่วงราคา ประเภท หรือเขตใหม่</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-[#0a0a0a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a40b6]"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#bbb]">
                    <span>Featured Projects</span>
                    <span>รายการทั้งหมด {filteredProperties.length} รายการ</span>
                  </div>
                  <div className="bg-white">
                    <div className="grid gap-10 py-5 md:py-8 lg:grid-cols-[0.38fr_0.62fr] lg:gap-14">
                      <div>
                        <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2d2d2d]">
                          <span>◆</span>
                          FEATURED PROJECTS
                        </p>
                      </div>

                      <div>
                        <h2 className="max-w-5xl text-[clamp(2.7rem,5.2vw,5.6rem)] font-light leading-[0.92] tracking-[-0.05em] text-[#171717]">
                          Each project tells its own story
                          <br />
                          of collaboration and precision.
                        </h2>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          <Link
                            href="#properties-list"
                            className="inline-flex items-center gap-3 bg-[#0f1214] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#20262b]"
                          >
                            <span style={{ fontFamily: "monospace" }}>↳</span>
                            VIEW PROJECTS
                          </Link>
                          <button
                            type="button"
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            className="inline-flex items-center gap-3 border border-[#171717] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#171717] transition hover:bg-[#171717] hover:text-white"
                          >
                            <span className="inline-block h-[1px] w-4 bg-current" />
                            ตัวกรองขั้นสูง
                            <span className="text-[10px] text-current/60">{activeFilters}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isFilterOpen ? "mt-8 max-h-[720px] opacity-100" : "mt-0 max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-y border-[#ddd8d2] bg-white py-5">
                        <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                          <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0a0a0a]">
                              Advanced Filters
                            </h3>
                            <p className="mt-1 text-xs text-[#8f8881]">ปรับเงื่อนไขเพื่อคัดบ้านที่ใกล้เคียงความต้องการ</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={clearFilters}
                              className="border border-[#d8d2ca] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#666] transition hover:border-[#171717] hover:text-[#0a0a0a]"
                            >
                              ล้างตัวกรอง
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsFilterOpen(false)}
                              className="border border-[#171717] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717] transition hover:bg-[#171717] hover:text-white"
                            >
                              ปิด
                            </button>
                          </div>
                        </div>
                        <HorizontalFilterControls
                          filters={filters}
                          developmentTypeOptions={developmentTypeOptions}
                          districtOptions={districtOptions}
                          handleFilterChange={handleFilterChange}
                          toggleArrayFilter={toggleArrayFilter}
                        />
                      </div>
                    </div>

                    <div id="properties-list" className="mt-[4.5rem] border-t border-[#8f877d]" />

                    <div className="relative bg-white">
                      {filteredProperties.map((property, idx) => {
                        const isHovered = hoveredPropertyId === property.id;

                        return (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                            viewport={{ once: true, margin: "-40px" }}
                            className="relative"
                          >
                            <Link
                              href={`/property/${property.id}`}
                              onClick={(event) => handlePropertyNavigate(property, event)}
                              onMouseEnter={() => setHoveredPropertyId(property.id)}
                              onFocus={() => setHoveredPropertyId(property.id)}
                              onMouseLeave={() => setHoveredPropertyId((current) => (current === property.id ? null : current))}
                              onBlur={() => setHoveredPropertyId((current) => (current === property.id ? null : current))}
                              className="group relative grid items-center gap-3 border-b border-[#8f877d] bg-white px-1 py-3 transition-colors duration-300 md:px-2 lg:grid-cols-[0.95fr_1.45fr_42px]"
                            >
                              <div className="min-w-0 lg:pr-8">
                                <div className="flex items-center gap-2">
                                  <h3 className="truncate text-[1.28rem] font-light tracking-[-0.035em] text-[#49443f] transition-colors duration-300 group-hover:text-[#171717] md:text-[1.4rem]">
                                    {property.title}
                                  </h3>
                                  <button
                                    onClick={(event) => handleToggleFavorite(property, event)}
                                    className={`hidden h-8 w-8 items-center justify-center rounded-full border transition md:inline-flex ${
                                      isFavorite(property.id)
                                        ? 'border-red-500 bg-red-500 text-white'
                                        : 'border-[#8f877d] bg-white text-[#2a2724] hover:border-[#171717]'
                                    }`}
                                    aria-label={isFavorite(property.id) ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
                                  >
                                    <svg
                                      className="h-3 w-3"
                                      fill={isFavorite(property.id) ? 'currentColor' : 'none'}
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  </button>
                                </div>
                                <p className="mt-1 truncate text-[0.8rem] text-[#625c56] md:text-[0.84rem]">
                                  {property.location}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5 lg:hidden">
                                  {buildPropertyTags(property).map((tag) => (
                                    <InlinePill key={`${property.id}-${tag}`} label={tag} />
                                  ))}
                                </div>
                              </div>

                              <div className="relative hidden min-h-[54px] items-center lg:flex">
                                <AnimatePresence mode="wait">
                                  {isHovered ? (
                                    <motion.div
                                      key={`preview-${property.id}`}
                                      initial={{ opacity: 0, scale: 0.97, y: 8 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.985, y: 4 }}
                                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                      className="absolute left-[-22px] top-1/2 z-10 h-[156px] w-[282px] -translate-y-1/2 overflow-hidden bg-[#ece7df] shadow-[0_22px_60px_-34px_rgba(0,0,0,0.32)]"
                                    >
                                      <Image
                                        src={property.image}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </motion.div>
                                  ) : null}
                                </AnimatePresence>

                                <div className="flex flex-wrap gap-1.5 pl-[50%]">
                                  {buildPropertyTags(property).map((tag) => (
                                    <InlinePill key={`${property.id}-${tag}`} label={tag} />
                                  ))}
                                </div>
                              </div>

                              <div className="hidden items-center justify-end text-[#6b645c] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#171717] lg:flex">
                                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function buildPropertyTags(property: Property) {
  const tags = [
    property.type === "เช่า" ? "RENTAL" : "FOR SALE",
    property.propertyType?.toUpperCase(),
    property.size ? `${property.size} SQ.M.` : undefined,
    property.bedrooms ? `${property.bedrooms} BEDROOMS` : undefined,
    property.bathrooms ? `${property.bathrooms} BATHROOMS` : undefined,
    buildPriceLabel(property).toUpperCase(),
  ].filter(Boolean) as string[];

  return tags.slice(0, 4);
}

function InlinePill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#8f877d] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#625c56]">
      {label}
    </span>
  );
}

function HorizontalFilterControls({
  filters,
  developmentTypeOptions,
  districtOptions,
  handleFilterChange,
  toggleArrayFilter,
}: FilterControlsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1.05fr_1.15fr_0.8fr]">
        {/* Listing Type */}
        <div className="border-b border-[#ebe4dc] pb-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">ประเภทประกาศ</p>
          <div className="flex flex-wrap gap-1.5">
            {LISTING_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleArrayFilter("listingType", type)}
                className="border px-3 py-1 text-[11px] font-semibold transition"
                style={filters.listingType.includes(type)
                  ? { background: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' }
                  : { background: '#fff', color: '#444', borderColor: '#d8d2ca' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Development Type */}
        <div className="border-b border-[#ebe4dc] pb-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">ประเภทการพัฒนา</p>
          <div className="flex flex-wrap gap-1.5">
            {developmentTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleArrayFilter("developmentType", type)}
                className="border px-2.5 py-1 text-[11px] transition"
                style={filters.developmentType.includes(type)
                  ? { background: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' }
                  : { background: '#fff', color: '#444', borderColor: '#d8d2ca' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Min Bedrooms */}
        <div className="border-b border-[#ebe4dc] pb-3">
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">ห้องนอนขั้นต่ำ</label>
          <select
            value={filters.minBedrooms}
            onChange={(event) => handleFilterChange("minBedrooms", event.target.value)}
            className="h-9 w-full border border-[#d8d2ca] bg-white px-3 text-sm text-[#0a0a0a] outline-none transition"
          >
            <option value="">ไม่ระบุ</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="border-b border-[#ebe4dc] pb-3 md:col-span-2 lg:col-span-2">
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">
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
            className="mb-2 h-1 w-full cursor-pointer appearance-none bg-[#e0e0e0] accent-[#111111]"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="ต่ำสุด"
              value={filters.priceRange[0]}
              onChange={(event) =>
                handleFilterChange("priceRange", [parseInt(event.target.value, 10) || 0, filters.priceRange[1]])
              }
              className="h-9 w-full border border-[#d8d2ca] bg-white px-2.5 text-sm text-[#0a0a0a] outline-none transition placeholder:text-[#ccc]"
            />
            <input
              type="number"
              placeholder="สูงสุด"
              value={filters.priceRange[1]}
              onChange={(event) =>
                handleFilterChange("priceRange", [filters.priceRange[0], parseInt(event.target.value, 10) || DEFAULT_MAX_PRICE])
              }
              className="h-9 w-full border border-[#d8d2ca] bg-white px-2.5 text-sm text-[#0a0a0a] outline-none transition placeholder:text-[#ccc]"
            />
          </div>
        </div>

        {/* Area Size */}
        <div className="border-b border-[#ebe4dc] pb-3 md:col-span-2 lg:col-span-1">
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">
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
            className="mb-2 h-1 w-full cursor-pointer appearance-none bg-[#e0e0e0] accent-[#111111]"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="ต่ำสุด"
              value={filters.areaSize[0]}
              onChange={(event) =>
                handleFilterChange("areaSize", [parseInt(event.target.value, 10) || 0, filters.areaSize[1]])
              }
              className="h-9 w-full border border-[#d8d2ca] bg-white px-2.5 text-sm text-[#0a0a0a] outline-none transition placeholder:text-[#ccc]"
            />
            <input
              type="number"
              placeholder="สูงสุด"
              value={filters.areaSize[1]}
              onChange={(event) =>
                handleFilterChange("areaSize", [filters.areaSize[0], parseInt(event.target.value, 10) || DEFAULT_MAX_AREA])
              }
              className="h-9 w-full border border-[#d8d2ca] bg-white px-2.5 text-sm text-[#0a0a0a] outline-none transition placeholder:text-[#ccc]"
            />
          </div>
        </div>
      </div>

      {/* District */}
      <div className="pt-1">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888]">เขต/อำเภอ</p>
        <div className="flex flex-wrap gap-1.5">
          {districtOptions.map((district) => (
            <button
              key={district}
              type="button"
              onClick={() => toggleArrayFilter("district", district)}
              className="border px-3 py-1 text-[11px] font-medium transition"
              style={filters.district.includes(district)
                ? { background: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a' }
                : { background: '#fff', color: '#444', borderColor: '#d8d2ca' }}
            >
              {district}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
