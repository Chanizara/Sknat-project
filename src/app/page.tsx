import Image from "next/image";
import Link from "next/link";

// Mock Data
const services = [
  {
    title: "ซื้อขายบ้าน (Buy & Sell)",
    description: "บริการนายหน้าซื้อขายบ้านและที่ดิน ครบวงจร พร้อมให้คำปรึกษาเรื่องสินเชื่อ",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    )
  },
  {
    title: "เช่าอสังหาฯ (Rent)",
    description: "หาบ้านเช่า คอนโด ออฟฟิศ ในทำเลที่คุณต้องการ ในราคาที่คุ้มค่า",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5l6.375-9.179a1.125 1.125 0 011.664-.21L12 9.675c.413.414 1.125.176 1.125-.407V4.5c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v4.5c0 .583.713.82 1.125.408l4.406-4.408a1.125 1.125 0 011.758.966V13.5a1.5 1.5 0 01-1.5 1.5h-2.25" />
      </svg>
    )
  },
  {
    title: "ประเมินราคา (Valuation)",
    description: "บริการประเมินราคาอสังหาริมทรัพย์ ตามราคาตลาดปัจจุบัน เพื่อการตัดสินใจที่ถูกต้อง",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    )
  },
];

const properties = [
  {
    id: 1,
    type: "House",
    title: "บ้านเดี่ยวสุดหรู พร้อมสระว่ายน้ำ",
    location: "บางนา, กรุงเทพฯ",
    price: "12,900,000 THB",
    image: "/globe.svg", // Placeholder
  },
  {
    id: 2,
    type: "Condo",
    title: "คอนโดหรู ใจกลางเมือง วิวแม่น้ำ",
    location: "สาทร, กรุงเทพฯ",
    price: "5,500,000 THB",
    image: "/file.svg", // Placeholder
  },
  {
    id: 3,
    type: "Townhouse",
    title: "ทาวน์โฮม 3 ชั้น ใกล้รถไฟฟ้า",
    location: "ลาดพร้าว, กรุงเทพฯ",
    price: "3,890,000 THB",
    image: "/window.svg", // Placeholder
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center">
               <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-blue-900">Sknat good</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#home" className="text-gray-600 hover:text-blue-700 font-medium transition">หน้าแรก</Link>
            <Link href="#about" className="text-gray-600 hover:text-blue-700 font-medium transition">เกี่ยวกับเรา</Link>
            <Link href="#services" className="text-gray-600 hover:text-blue-700 font-medium transition">บริการ</Link>
            <Link href="#properties" className="text-gray-600 hover:text-blue-700 font-medium transition">ทรัพย์สิน</Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-700 font-medium transition">ติดต่อเรา</Link>
          </nav>
          <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section (Landing Page) */}
      <section id="home" className="relative bg-blue-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90 overflow-hidden">
             {/* Simple pattern or image overlay could go here */}
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            หาบ้านในฝันของคุณ<br/>เริ่มต้นที่ <span className="text-blue-300">Sknat good</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            เราคือผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ รวบรวมบ้าน คอนโด และที่ดินคุณภาพดีที่สุดในทำเลศักยภาพ เพื่อคุณโดยเฉพาะ
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#properties" className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition">
              ดูทรัพย์สินทั้งหมด
            </Link>
            <Link href="#contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-900 transition">
              ปรึกษาเราฟรี
            </Link>
          </div>
        </div>
      </section>

      {/* About Comapny Detail */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
               <div className="bg-gray-200 w-full h-80 rounded-2xl flex items-center justify-center text-gray-400">
                  {/* Placeholder for About Image */}
                  <span className="text-lg">ภาพบริษัท / ทีมงาน</span>
               </div>
            </div>
            <div className="md:w-1/2">
              <h4 className="text-blue-600 font-semibold mb-2">เกี่ยวกับเรา (About Us)</h4>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">บริษัท สแกนัท เอสเตท จำกัด (Sknat good)</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                เราคือบริษัทตัวแทนอสังหาริมทรัพย์ชั้นนำ ที่มุ่งมั่นให้บริการด้วยความซื่อสัตย์และเป็นมืออาชีพ 
                ด้วยประสบการณ์กว่า 10 ปีในวงการอสังหาฯ เราพร้อมดูแลทุกขั้นตอน ตั้งแต่การหาทรัพย์ที่ใช่ 
                ไปจนถึงขั้นตอนการโอนกรรมสิทธิ์
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>ทีมงานมืออาชีพและมีประสบการณ์สูง</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>บริการครบวงจร ซื้อ-ขาย-เช่า</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>ให้คำปรึกษาด้านสินเชื่อฟรี</span>
                </li>
              </ul>
              <Link href="#contact" className="text-blue-700 font-semibold hover:underline">เรียนรู้เพิ่มเติม &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">บริการของเรา (Our Services)</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              เราพร้อมดูแลและตอบโจทย์ทุกความต้องการด้านอสังหาริมทรัพย์ของคุณ
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties (Data Property) */}
      <section id="properties" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">ทรัพย์สินแนะนำ (Featured Properties)</h2>
              <p className="text-gray-600">เลือกชมอสังหาริมทรัพย์คุณภาพที่เราคัดสรรมาให้</p>
            </div>
            <Link href="#contact" className="hidden md:block px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
              ดูทั้งหมด
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div key={prop.id} className="group bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition">
                <div className="relative h-64 bg-gray-200">
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                     <Image src={prop.image} alt={prop.title} width={64} height={64} className="opacity-50" />
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {prop.type}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2 space-x-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                     <span>{prop.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{prop.title}</h3>
                  <p className="text-2xl font-bold text-blue-800">{prop.price}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">3 ห้องนอน • 2 ห้องน้ำ</span>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">ดูรายละเอียด</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Link href="#contact" className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
              ดูทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">ติดต่อเรา (Contact Us)</h2>
              <p className="text-blue-200 mb-8 max-w-md">
                หากคุณมีข้อสงสัยหรือต้องการปรึกษาเรื่องอสังหาริมทรัพย์ ทีมงานของเราพร้อมให้บริการคุณด้วยความเต็มใจ
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">ที่อยู่ (Location)</h4>
                    <p className="text-blue-200">123 อาคารสแกนัท ถนนสุขุมวิท<br/>เขตคลองเตย กรุงเทพมหานคร 10110</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">เบอร์โทรศัพท์ (Phone Number)</h4>
                    <p className="text-blue-200">02-123-4567, 089-999-9999</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    </div>
                  <div>
                    <h4 className="font-bold text-lg">หน้าเว็บและโซเชียลมีเดีย (Page Link)</h4>
                    <a href="#" className="text-blue-200 hover:text-white block">www.sknat-good.com</a>
                    <a href="#" className="text-blue-200 hover:text-white block">facebook.com/sknatgood</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl text-gray-900">
               <h3 className="text-2xl font-bold mb-6">ส่งข้อความถึงเรา</h3>
               <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="กรอกชื่อของคุณ" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์ติดต่อ</label>
                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="กรอกเบอร์โทรศัพท์" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความ</label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="รายละเอียดที่ต้องการสอบถาม"></textarea>
                  </div>
                  <button type="button" className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">ส่งข้อความ</button>
               </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
           <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white text-lg font-bold mb-4">Sknat good</h4>
                <p className="text-sm">บริการอสังหาริมทรัพย์ครบวงจร ที่ปรึกษาที่คุณวางใจได้</p>
              </div>
              <div>
                <h4 className="text-white text-lg font-bold mb-4">ลิงก์ด่วน</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#home" className="hover:text-white">หน้าแรก</Link></li>
                  <li><Link href="#about" className="hover:text-white">เกี่ยวกับเรา</Link></li>
                  <li><Link href="#services" className="hover:text-white">บริการ</Link></li>
                  <li><Link href="#contact" className="hover:text-white">ติดต่อเรา</Link></li>
                </ul>
              </div>
              <div>
                 <h4 className="text-white text-lg font-bold mb-4">บริการ</h4>
                 <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">ซื้อบ้าน</a></li>
                  <li><a href="#" className="hover:text-white">เช่าคอนโด</a></li>
                  <li><a href="#" className="hover:text-white">ฝากขาย</a></li>
                 </ul>
              </div>
              <div>
                <h4 className="text-white text-lg font-bold mb-4">ติดตามเรา</h4>
                <div className="flex space-x-4">
                  {/* Social Icons placeholders */}
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">F</div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-sky-500 transition cursor-pointer">T</div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition cursor-pointer">L</div>
                </div>
              </div>
           </div>
           <div className="text-center pt-8 border-t border-gray-800 text-sm">
            <p>&copy; {new Date().getFullYear()} Sknat good. All rights reserved.</p>
           </div>
        </div>
      </footer>

    </div>
  );
}

