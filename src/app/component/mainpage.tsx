'use client';

import Image from "next/image";
import Link from "next/link";
import { type Property, type Service } from "../../mock";
import { useState, useMemo } from "react";
import PropertyModal from "./PropertyModal";

type MainPageProps = {
  services: Service[];
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

export default function MainPage({ services, properties }: MainPageProps) {
  const [filters, setFilters] = useState<Filters>({
    searchKeyword: '',
    areaType: [],
    listingType: [],
    developmentType: [],
    priceRange: [0, 50000000],
    areaSize: [0, 500],
    minBedrooms: '',
    district: []
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPropertyModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closePropertyModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProperty(null), 300);
  };

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Search keyword
      if (filters.searchKeyword && !prop.title.toLowerCase().includes(filters.searchKeyword.toLowerCase()) 
          && !prop.location.toLowerCase().includes(filters.searchKeyword.toLowerCase())) {
        return false;
      }

      // Area type
      if (filters.areaType.length > 0 && !filters.areaType.includes(prop.category || '')) {
        return false;
      }

      // Listing type
      if (filters.listingType.length > 0 && !filters.listingType.includes(prop.type)) {
        return false;
      }

      // Development type
      if (filters.developmentType.length > 0 && !filters.developmentType.includes(prop.propertyType || '')) {
        return false;
      }

      // Price range
      const propPrice = parseFloat(prop.price.replace(/[฿,]/g, ''));
      if (propPrice < filters.priceRange[0] || propPrice > filters.priceRange[1]) {
        return false;
      }

      // Area size
      if (prop.size) {
        const propSize = parseFloat(prop.size.toString());
        if (propSize < filters.areaSize[0] || propSize > filters.areaSize[1]) {
          return false;
        }
      }

      // Minimum bedrooms
      if (filters.minBedrooms && prop.bedrooms) {
        if (prop.bedrooms < parseInt(filters.minBedrooms)) {
          return false;
        }
      }

      // District
      if (filters.district.length > 0) {
        const propDistrict = prop.location.split(',')[0].trim();
        if (!filters.district.includes(propDistrict)) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleArrayFilter = (filterType: 'areaType' | 'listingType' | 'developmentType' | 'district', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchKeyword: '',
      areaType: [],
      listingType: [],
      developmentType: [],
      priceRange: [0, 50000000],
      areaSize: [0, 500],
      minBedrooms: '',
      district: []
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      
      {/* Properties with Filter System */}
      <section id="properties" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">อสังหาริมทรัพย์ที่พร้อมขาย</h2>
            <p className="text-gray-600">พบ {filteredProperties.length} รายการ</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-1/4 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">ค้นหาและกรองข้อมูล</h3>
                  </div>
                </div>

                {/* Search Keyword */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำหลัก</label>
                  <input
                    type="text"
                    placeholder="ที่อยู่อาศัย, ทำนา, หรือวา"
                    value={filters.searchKeyword}
                    onChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Area Type - พื้นที่ */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">พื้นที่</label>
                  <div className="space-y-2">
                    {['ที่อยู่อาศัย', 'ทำนา', 'หรือวา'].map(type => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.areaType.includes(type)}
                          onChange={() => toggleArrayFilter('areaType', type)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Listing Type - ประเภทที่ดิน */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทที่ดิน</label>
                  <div className="flex gap-2">
                    {['ขาย', 'เช่า'].map(type => (
                      <button
                        key={type}
                        onClick={() => toggleArrayFilter('listingType', type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          filters.listingType.includes(type)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Development Type - ประเภทการพัฒนา */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทการพัฒนา</label>
                  <div className="space-y-2">
                    {['บ้านเดี่ยว', 'ทาวน์เฮ้า', 'คอนโด', 'ที่ดิน'].map(type => (
                      <button
                        key={type}
                        onClick={() => toggleArrayFilter('developmentType', type)}
                        className={`w-full px-3 py-2 rounded-lg text-sm text-left transition ${
                          filters.developmentType.includes(type)
                            ? 'bg-blue-50 text-blue-700 border border-blue-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ช่วงราคา: ฿{filters.priceRange[0].toLocaleString()} - ฿{filters.priceRange[1].toLocaleString()}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="100000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="ต่ำสุด"
                        value={filters.priceRange[0]}
                        onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                        className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="สูงสุด"
                        value={filters.priceRange[1]}
                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 50000000])}
                        className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Area Size */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ขนาดพื้นที่: {filters.areaSize[0]} - {filters.areaSize[1]} ตร.ม.
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={filters.areaSize[1]}
                      onChange={(e) => handleFilterChange('areaSize', [filters.areaSize[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="ต่ำสุด"
                        value={filters.areaSize[0]}
                        onChange={(e) => handleFilterChange('areaSize', [parseInt(e.target.value) || 0, filters.areaSize[1]])}
                        className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="number"
                        placeholder="สูงสุด"
                        value={filters.areaSize[1]}
                        onChange={(e) => handleFilterChange('areaSize', [filters.areaSize[0], parseInt(e.target.value) || 500])}
                        className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Bedrooms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนห้องนอนขั้นต่ำ</label>
                  <select
                    value={filters.minBedrooms}
                    onChange={(e) => handleFilterChange('minBedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">ไม่ระบุ</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* District */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">เซต/อำเภอ</label>
                  <div className="space-y-2">
                    {['เมือง นางรอง', 'สาทร', 'บางรัก', 'ปทุมวัน'].map(district => (
                      <label key={district} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.district.includes(district)}
                          onChange={() => toggleArrayFilter('district', district)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{district}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            </div>

            {/* Right Side - Property Listings */}
            <div className="lg:w-3/4">
              {filteredProperties.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบอสังหาริมทรัพย์</h3>
                  <p className="text-gray-600 mb-4">ลองปรับเปลี่ยนตัวกรองเพื่อค้นหาอสังหาริมทรัพย์</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredProperties.map((prop) => (
                    <div key={prop.id} className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition">
                      <div className="relative h-56 bg-gray-200">
                        {/* Image */}
                        <Image 
                          src={prop.image} 
                          alt={prop.title} 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {prop.type}
                          </div>
                          {prop.propertyType && (
                            <div className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                              {prop.propertyType}
                            </div>
                          )}
                        </div>
                        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition">
                          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center text-gray-500 text-sm mb-2 gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          <span>{prop.location}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition line-clamp-1">
                          {prop.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          {prop.size && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              <span>{prop.size} ตร.ม.</span>
                            </div>
                          )}
                          {prop.bedrooms && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>{prop.bedrooms}</span>
                            </div>
                          )}
                          {prop.bathrooms && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                              </svg>
                              <span>{prop.bathrooms}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">{prop.price}</p>
                            {prop.pricePerSqm && (
                              <p className="text-xs text-gray-500">฿{prop.pricePerSqm.toLocaleString()}/ตร.ม.</p>
                            )}
                          </div>
                          <button 
                            onClick={() => openPropertyModal(prop)}
                            className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:gap-2 transition-all"
                          >
                            <span>ดูรายละเอียด</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={closePropertyModal}
        />
      )}

    </div>
  );
}
