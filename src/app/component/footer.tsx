import Image from "next/image";
import Link from "next/link";
import { type Property, type Service } from "../../mock";

type MainPageProps = {
  services: Service[];
  properties: Property[];
};

export default function Footer() {
  return (

    <>
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
    </>
        )
}
