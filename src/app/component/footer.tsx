import Link from "next/link";

export default function Footer() {
  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-[linear-gradient(180deg,#edf2f7_0%,#dfe8f1_100%)] py-20 text-slate-900">
        <div className="pointer-events-none absolute -left-16 top-14 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">CONCIERGE CONTACT</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">พูดคุยกับที่ปรึกษาบ้านของคุณ</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
              บริการแบบ private consultation สำหรับบ้านหรู บ้านพักตากอากาศ และพูลวิลล่า พร้อมคำแนะนำที่เหมาะกับงบและไลฟ์สไตล์
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-7">
              <ContactItem
                title="ที่ตั้งสำนักงาน"
                detail="123 อาคารสแกนัท ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110"
              />
              <ContactItem title="เบอร์โทร" detail="02-123-4567, 089-999-9999" />
              <ContactItem title="อีเมล" detail="hello@sknat.co.th" />
              <ContactItem title="เว็บไซต์" detail="www.sknat-good.com" />
            </div>

            <div className="rounded-[2rem] bg-white/72 p-6 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.55)] backdrop-blur-xl md:p-8">
              <h3 className="text-2xl font-semibold text-slate-950">ส่งข้อความหาเรา</h3>
              <p className="mt-2 text-sm text-slate-600">ทิ้งข้อมูลไว้ ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>

              <form className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    placeholder="กรอกชื่อของคุณ"
                    className="h-11 w-full border-b border-slate-300 bg-transparent px-0 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">เบอร์ติดต่อ</label>
                  <input
                    type="tel"
                    placeholder="กรอกเบอร์โทรศัพท์"
                    className="h-11 w-full border-b border-slate-300 bg-transparent px-0 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">ข้อความ</label>
                  <textarea
                    rows={4}
                    placeholder="รายละเอียดที่ต้องการสอบถาม"
                    className="w-full border-b border-slate-300 bg-transparent px-0 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  ส่งข้อความ
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-slate-950 py-14 text-slate-300">
        <div className="pointer-events-none absolute -top-20 right-12 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">SKNAT</p>
              <h4 className="mt-2 text-2xl font-semibold text-white">Sknat Property</h4>
              <p className="mt-3 max-w-md text-sm text-slate-400">บริการอสังหาริมทรัพย์สำหรับผู้ที่ต้องการประสบการณ์หาบ้านที่เป็นระบบ โปร่งใส และพรีเมียม</p>
            </div>

            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">เมนู</h5>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="#home" className="transition hover:text-white">
                    หน้าแรก
                  </Link>
                </li>
                <li>
                  <Link href="#properties" className="transition hover:text-white">
                    บ้านทั้งหมด
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="transition hover:text-white">
                    ติดต่อเรา
                  </Link>
                </li>
                <li>
                  <Link href="/admin/properties" className="transition hover:text-white">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">เวลาทำการ</h5>
              <p className="mt-3 text-sm text-slate-400">จันทร์ - เสาร์ 09:00 - 18:00</p>
              <p className="mt-1 text-sm text-slate-400">โทร 02-123-4567</p>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} SKNAT Property. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

type ContactItemProps = {
  title: string;
  detail: string;
};

function ContactItem({ title, detail }: ContactItemProps) {
  return (
    <div className="relative pl-8">
      <span className="absolute left-0 top-[7px] h-2.5 w-2.5 rounded-full bg-slate-900" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-800">{detail}</p>
    </div>
  );
}
