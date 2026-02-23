# SKNAT Real Estate Web

ระบบเว็บอสังหาริมทรัพย์ที่มี
- หน้าเว็บลูกค้าแสดงรายการบ้านจากฐานข้อมูล MySQL
- หน้า `admin/seller` สำหรับเพิ่ม/แก้ไข/ลบรายการบ้าน
- API สำหรับจัดการ `properties` และ `users`

## 1) รันฐานข้อมูล (MySQL + phpMyAdmin)

จากโฟลเดอร์โปรเจกต์ `/Users/riw/Desktop/sknat_all/web`

```bash
docker compose up -d
```

สิ่งที่จะได้
- MySQL: `127.0.0.1:3307`
- phpMyAdmin: `http://localhost:8081`

ข้อมูลตั้งต้น
- Database: `sknat_db`
- User app: `sknat_user` / `sknat_pass123`
- Root: `root` / `root123`

ตารางสำคัญ
- `users` (เก็บ `username`, `password_hash`, `role`)
- `properties` (เก็บข้อมูลบ้าน)

Seeder เริ่มต้นใน `docker/mysql/init/01-schema.sql`
- admin: `admin / Admin@1234`
- seller: `seller1 / Seller@1234`

## 2) ตั้งค่า environment ของเว็บ

ในโฟลเดอร์ `/Users/riw/Desktop/sknat_all/web`

```bash
cp .env.example .env.local
```

## 3) ติดตั้ง dependencies และรันเว็บ

```bash
npm install
npm run dev
```

เปิดเว็บ
- ลูกค้า: `http://localhost:3000`
- จัดการข้อมูลบ้าน: `http://localhost:3000/admin/properties`

## 4) API ที่มี

- `GET /api/properties` รายการบ้านทั้งหมด
- `POST /api/properties` เพิ่มบ้าน
- `GET /api/properties/:id` รายละเอียดบ้าน
- `PATCH /api/properties/:id` แก้ไขบ้าน
- `DELETE /api/properties/:id` ลบบ้าน

- `GET /api/users` รายชื่อผู้ใช้ (admin/seller)
- `POST /api/users` เพิ่มผู้ใช้
- `POST /api/auth/login` ตรวจสอบ username/password

## หมายเหตุเรื่องความปลอดภัย

ตัวอย่างนี้เก็บรหัสผ่านแบบ SHA-256 เพื่อให้เริ่มใช้งานได้เร็ว
สำหรับ production ควรเปลี่ยนเป็น `bcrypt/argon2` และเพิ่ม session/JWT + authorization ก่อนใช้งานจริง
