import { type ReactNode } from "react";

export type Service = {
  title: string;
  description: string;
  icon: ReactNode;
};

export type Property = {
  id: number;
  type: string;
  title: string;
  location: string;
  price: string;
  image: string;
  category?: string;
  propertyType?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  pricePerSqm?: number;
  description?: string;
  features?: string[];
  lat?: number;
  lng?: number;
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
  images?: string[];
};

export const services: Service[] = [
  {
    title: "ซื้อขายบ้าน (Buy & Sell)",
    description: "บริการนายหน้าซื้อขายบ้านและที่ดิน ครบวงจร พร้อมให้คำปรึกษาเรื่องสินเชื่อ",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: "เช่าอสังหาฯ (Rent)",
    description: "หาบ้านเช่า คอนโด ออฟฟิศ ในทำเลที่คุณต้องการ ในราคาที่คุ้มค่า",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5l6.375-9.179a1.125 1.125 0 011.664-.21L12 9.675c.413.414 1.125.176 1.125-.407V4.5c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v4.5c0 .583.713.82 1.125.408l4.406-4.408a1.125 1.125 0 011.758.966V13.5a1.5 1.5 0 01-1.5 1.5h-2.25" />
      </svg>
    ),
  },
  {
    title: "ประเมินราคา (Valuation)",
    description: "บริการประเมินราคาอสังหาริมทรัพย์ ตามราคาตลาดปัจจุบัน เพื่อการตัดสินใจที่ถูกต้อง",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
];

export const properties: Property[] = [
  {
    id: 1,
    type: "ขาย",
    title: "บ้านเดี่ยว 2 ชั้น พร้อมสระว่ายน้ำ",
    location: "บางนา, กรุงเทพมหานคร",
    price: "฿15,000,000",
    image: "/hero_1.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "บ้านเดี่ยว",
    size: 350,
    bedrooms: 4,
    bathrooms: 4,
    pricePerSqm: 42857,
    description: "บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น พร้อมสระว่ายน้ำส่วนตัว ตกแต่งพร้อมอยู่ ทำเลดี ใกล้ BTS บางนา เดินทางสะดวก ย่านชุมชนเงียบสงบ ปลอดภัย",
    features: [
      "สระว่ายน้ำส่วนตัว",
      "ที่จอดรถ 2 คัน",
      "ครัวบิ้วอิน",
      "ระบบรักษาความปลอดภัย 24 ชม.",
      "สวนหน้าบ้าน",
      "ใกล้ BTS"
    ],
    lat: 13.6684,
    lng: 100.6037,
    agent: {
      name: "คุณสมชาย ใจดี",
      phone: "02-123-4567",
      email: "somchai@realestate.com"
    },
    images: ["/hero_1.jpg", "/hero_2.jpg", "/hero_3.jpg"]
  },
  {
    id: 2,
    type: "ขาย",
    title: "คอนโดโมเดิร์น ใจกลางเมือง วิวแม่น้ำ",
    location: "สาทร, กรุงเทพมหานคร",
    price: "฿8,500,000",
    image: "/hero_2.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "คอนโด",
    size: 120,
    bedrooms: 2,
    bathrooms: 2,
    pricePerSqm: 70833,
    description: "คอนโดหรู ชั้นสูง วิวแม่น้ำเจ้าพระยาสวยงาม ตกแต่งครบพร้อมเฟอร์นิเจอร์ ใกล้ BTS สาทร สะดวกสบายครบครัน",
    features: [
      "วิวแม่น้ำเจ้าพระยา",
      "ฟิตเนส & สระว่ายน้ำ",
      "ระบบ Smart Home",
      "ที่จอดรถ 1 คัน",
      "Security 24 ชม.",
      "ใกล้ BTS สาทร"
    ],
    lat: 13.7244,
    lng: 100.5320,
    agent: {
      name: "คุณวิภา นันทะเสน",
      phone: "02-234-5678",
      email: "wipa@realestate.com"
    },
    images: ["/hero_2.jpg", "/hero_1.jpg", "/hero_3.jpg"]
  },
  {
    id: 3,
    type: "เช่า",
    title: "ทาวน์โฮม 3 ชั้น ใกล้รถไฟฟ้า",
    location: "บางรัก, กรุงเทพมหานคร",
    price: "฿25,000",
    image: "/hero_3.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "ทาวน์เฮ้า",
    size: 180,
    bedrooms: 3,
    bathrooms: 3,
    pricePerSqm: 139,
    description: "ทาวน์โฮม 3 ชั้น สภาพใหม่ พร้อมอยู่ ใกล้ MRT สีลม เดินทางสะดวก บรรยากาศดี เหมาะสำหรับครอบครัว",
    features: [
      "ใกล้ MRT สีลม",
      "ที่จอดรถ 2 คัน",
      "พื้นที่ใช้สอย 3 ชั้น",
      "แอร์ 4 เครื่อง",
      "เฟอร์นิเจอร์บางส่วน",
      "ห้างสรรพสินค้าใกล้เคียง"
    ],
    lat: 13.7248,
    lng: 100.5340,
    agent: {
      name: "คุณประเสริฐ สุขใจ",
      phone: "02-345-6789",
      email: "prasert@realestate.com"
    },
    images: ["/hero_3.jpg", "/hero_2.jpg", "/hero_1.jpg"]
  },
  {
    id: 4,
    type: "ขาย",
    title: "บ้านเดี่ยวสไตล์โมเดิร์น พร้อมสวน",
    location: "เมือง นางรอง, บุรีรัมย์",
    price: "฿6,800,000",
    image: "/hero_1.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "บ้านเดี่ยว",
    size: 280,
    bedrooms: 3,
    bathrooms: 3,
    pricePerSqm: 24286
  },
  {
    id: 5,
    type: "ขาย",
    title: "ที่ดินเปล่า ติดถนนใหญ่",
    location: "ปทุมวัน, กรุงเทพมหานคร",
    price: "฿45,000,000",
    image: "/hero_2.jpg",
    category: "ทำนา",
    propertyType: "ที่ดิน",
    size: 400,
    pricePerSqm: 112500
  },
  {
    id: 6,
    type: "เช่า",
    title: "คอนโดใหม่ โครงการหรู ฟิตเนสครบ",
    location: "สาทร, กรุงเทพมหานคร",
    price: "฿35,000",
    image: "/hero_3.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "คอนโด",
    size: 85,
    bedrooms: 2,
    bathrooms: 1,
    pricePerSqm: 412
  },
  {
    id: 7,
    type: "ขาย",
    title: "บ้านเดี่ยว 2 ชั้น ย่านเงียบสงบ",
    location: "บางรัก, กรุงเทพมหานคร",
    price: "฿9,200,000",
    image: "/hero_1.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "บ้านเดี่ยว",
    size: 250,
    bedrooms: 4,
    bathrooms: 3,
    pricePerSqm: 36800
  },
  {
    id: 8,
    type: "ขาย",
    title: "ทาวน์เฮ้าส์ใหม่ ตกแต่งพร้อมอยู่",
    location: "ปทุมวัน, กรุงเทพมหานคร",
    price: "฿4,500,000",
    image: "/hero_2.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "ทาวน์เฮ้า",
    size: 150,
    bedrooms: 3,
    bathrooms: 2,
    pricePerSqm: 30000
  },
  {
    id: 9,
    type: "เช่า",
    title: "บ้านเดี่ยวชั้นเดียว สวนสวย",
    location: "เมือง นางรอง, บุรีรัมย์",
    price: "฿18,000",
    image: "/hero_3.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "บ้านเดี่ยว",
    size: 200,
    bedrooms: 3,
    bathrooms: 2,
    pricePerSqm: 90
  },
  {
    id: 10,
    type: "ขาย",
    title: "คอนโด วิวทะเล ชั้นสูง",
    location: "สาทร, กรุงเทพมหานคร",
    price: "฿12,000,000",
    image: "/hero_1.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "คอนโด",
    size: 95,
    bedrooms: 2,
    bathrooms: 2,
    pricePerSqm: 126316
  },
  {
    id: 11,
    type: "ขาย",
    title: "บ้านสวน พื้นที่กว้าง",
    location: "เมือง นางรอง, บุรีรัมย์",
    price: "฿3,200,000",
    image: "/hero_2.jpg",
    category: "หรือวา",
    propertyType: "บ้านเดี่ยว",
    size: 320,
    bedrooms: 3,
    bathrooms: 2,
    pricePerSqm: 10000
  },
  {
    id: 12,
    type: "เช่า",
    title: "ทาวน์โฮมใหม่ ใกล้ห้างสรรพสินค้า",
    location: "ปทุมวัน, กรุงเทพมหานคร",
    price: "฿28,000",
    image: "/hero_3.jpg",
    category: "ที่อยู่อาศัย",
    propertyType: "ทาวน์เฮ้า",
    size: 160,
    bedrooms: 3,
    bathrooms: 3,
    pricePerSqm: 175
  }
];
