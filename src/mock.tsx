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
    type: "House",
    title: "บ้านเดี่ยวสุดหรู พร้อมสระว่ายน้ำ",
    location: "บางนา, กรุงเทพฯ",
    price: "12,900,000 THB",
    image: "/globe.svg",
  },
  {
    id: 2,
    type: "Condo",
    title: "คอนโดหรู ใจกลางเมือง วิวแม่น้ำ",
    location: "สาทร, กรุงเทพฯ",
    price: "5,500,000 THB",
    image: "/file.svg",
  },
  {
    id: 3,
    type: "Townhouse",
    title: "ทาวน์โฮม 3 ชั้น ใกล้รถไฟฟ้า",
    location: "ลาดพร้าว, กรุงเทพฯ",
    price: "3,890,000 THB",
    image: "/window.svg",
  },
];
