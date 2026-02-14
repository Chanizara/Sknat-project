import Image from "next/image";
import Link from "next/link";
import { type Property, type Service } from "../../mock";

type MainPageProps = {
  services: Service[];
  properties: Property[];
};

export default function MainPage({ services, properties }: MainPageProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      
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

    </div>
  );
}
