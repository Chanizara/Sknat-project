'use client';

import Image from "next/image";
import { useState } from "react";

import { buildPriceLabel, formatPrice, formatUpdatedAt } from "@/lib/property-format";
import { type Property } from "@/types/property";

type PropertyModalProps = {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
};

export default function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen) {
    return null;
  }

  const openMapInNewTab = () => {
    if (property.lat === undefined || property.lng === undefined) {
      return;
    }
    const mapUrl = `/map?lat=${property.lat}&lng=${property.lng}&title=${encodeURIComponent(property.title)}`;
    window.open(mapUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-3 mb-6 border-b border-gray-200">
            <button type="button" className="px-4 py-2 bg-gray-900 text-white rounded-t-lg font-medium">
              {property.category ?? "อสังหาริมทรัพย์"}
            </button>
            <button type="button" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg font-medium">
              {property.type}
            </button>
            <button type="button" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg font-medium">
              {property.propertyType ?? "-"}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden mb-3">
                <Image
                  src={property.images?.[selectedImage] || property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>

              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={image + index}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index ? "border-blue-600" : "border-transparent"
                      }`}
                    >
                      <Image src={image} alt={`${property.title} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">รายละเอียดเพิ่มเติม</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {property.description ?? "ยังไม่มีรายละเอียดเพิ่มเติม"}
                </p>
              </div>

              {property.features && property.features.length > 0 ? (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">จุดเด่น</h3>
                  <ul className="space-y-2">
                    {property.features.map((feature, index) => (
                      <li key={feature + index} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div>
              <div className="bg-blue-50 rounded-lg p-5 mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">{buildPriceLabel(property)}</div>
                {property.pricePerSqm ? <div className="text-sm text-gray-600">{formatPrice(property.pricePerSqm)}/ตร.ม.</div> : null}
                {property.type === "ขาย" ? (
                  <div className="text-sm text-gray-500 mt-1">{formatPrice(property.price * 0.75)} (ประมาณ)</div>
                ) : null}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">ประเภท</span>
                  <span className="font-semibold text-gray-900">{property.propertyType ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">ขนาดพื้นที่</span>
                  <span className="font-semibold text-gray-900">{property.size ? `${property.size} ตร.ม.` : "-"}</span>
                </div>
                {property.bedrooms ? (
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">ห้องนอน</span>
                    <span className="font-semibold text-gray-900">{property.bedrooms}</span>
                  </div>
                ) : null}
                {property.bathrooms ? (
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">ห้องน้ำ</span>
                    <span className="font-semibold text-gray-900">{property.bathrooms}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">ที่อยู่</span>
                  <span className="font-semibold text-gray-900 text-right">{property.location}</span>
                </div>
              </div>

              {property.agent ? (
                <div className="bg-gray-50 rounded-lg p-5 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    ติดต่อสอบถาม
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-gray-900 font-medium">เจ้าหน้าที่: {property.agent.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-700">โทร: {property.agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-700">อีเมล: {property.agent.email}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={openMapInNewTab}
                  disabled={property.lat === undefined || property.lng === undefined}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  ดูตำแหน่งบนแผนที่
                </button>
                <button type="button" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  แจ้งความสนใจ
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">รหัสทรัพย์สิน: p{String(property.id).padStart(3, "0")}</p>
                <p className="text-xs text-gray-500 mt-1">ข้อมูลปรับปรุง: {formatUpdatedAt(property.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
