
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
    </div>
  );
}