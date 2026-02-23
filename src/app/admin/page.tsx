"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserGroupIcon,
  MembersIcon,
  BuildingIcon,
  ClipboardIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
} from "./components/Icons";

// Modern Stat Card Component
function StatCard({
  title,
  value,
  subtext,
  change,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtext: string;
  change: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${gradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            <TrendingUpIcon className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold text-white">{change}</span>
          </div>
        </div>

        {/* Stats */}
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-4xl font-bold text-white mb-1">{value}</p>
          <p className="text-white/70 text-xs">{subtext}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 12,
    totalMembers: 156,
    totalProperties: 89,
    pendingOrders: 8,
  });

  const recentActivities = [
    {
      id: 1,
      icon: CheckCircleIcon,
      title: "ขายสำเร็จ",
      description: "คอนโด Lumpini Suite ราคา 3.2 ล้านบาท",
      time: "5 นาทีที่แล้ว",
      color: "emerald",
    },
    {
      id: 2,
      icon: BuildingIcon,
      title: "ทรัพย์สินใหม่",
      description: "บ้านเดี่ยว 2 ชั้น หมู่บ้านสวนดอก",
      time: "15 นาทีที่แล้ว",
      color: "blue",
    },
    {
      id: 3,
      icon: ClockIcon,
      title: "รอการติดต่อ",
      description: "คุณสมชาย ใจดี สนใจทาวน์โฮม #1234",
      time: "1 ชั่วโมงที่แล้ว",
      color: "amber",
    },
    {
      id: 4,
      icon: MembersIcon,
      title: "สมาชิกใหม่",
      description: "คุณสมหญิง รักดี ลงทะเบียนเข้าระบบ",
      time: "2 ชั่วโมงที่แล้ว",
      color: "violet",
    },
  ];

  const quickActions = [
    {
      title: "เพิ่มทรัพย์สิน",
      description: "เพิ่มอสังหาฯ ใหม่",
      icon: BuildingIcon,
      href: "/admin/properties",
      color: "bg-blue-500",
    },
    {
      title: "ตรวจสอบคำสั่งซื้อ",
      description: "รายการรอดำเนินการ",
      icon: ClipboardIcon,
      href: "/admin/orders",
      color: "bg-purple-500",
    },
    {
      title: "จัดการสมาชิก",
      description: "ดูรายชื่อลูกค้า",
      icon: MembersIcon,
      href: "/admin/members",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-violet-900 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600">ภาพรวมระบบจัดการอสังหาริมทรัพย์</p>
          </div>
          <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-md border border-slate-200">
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">วันนี้</p>
              <p className="text-sm font-bold text-slate-800">24 ก.พ. 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ผู้ใช้งาน"
          value={stats.totalUsers}
          subtext="เจ้าหน้าที่ในระบบ"
          change="+5"
          icon={UserGroupIcon}
          gradient="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500"
        />
        <StatCard
          title="สมาชิก"
          value={stats.totalMembers}
          subtext="ลูกค้าในระบบ"
          change="+12"
          icon={MembersIcon}
          gradient="bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500"
        />
        <StatCard
          title="ทรัพย์สิน"
          value={stats.totalProperties}
          subtext="อสังหาริมทรัพย์"
          change="+8"
          icon={BuildingIcon}
          gradient="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500"
        />
        <StatCard
          title="คำสั่งซื้อ"
          value={stats.pendingOrders}
          subtext="รอดำเนินการ"
          change="+2"
          icon={ClipboardIcon}
          gradient="bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">กิจกรรมล่าสุด</h2>
                  <p className="text-sm text-slate-500 mt-1">อัปเดตล่าสุดของระบบ</p>
                </div>
                <Link
                  href="/admin/history"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ดูทั้งหมด →
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  const colorClasses = {
                    emerald: "bg-emerald-100 text-emerald-600",
                    blue: "bg-blue-100 text-blue-600",
                    amber: "bg-amber-100 text-amber-600",
                    violet: "bg-violet-100 text-violet-600",
                  };

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 group cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          colorClasses[activity.color as keyof typeof colorClasses]
                        } group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">{activity.title}</p>
                            <p className="text-sm text-slate-600 mt-0.5">{activity.description}</p>
                          </div>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-500 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">สถิติด่วน</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <div>
                  <p className="text-xs text-white/80">ยอดขายวันนี้</p>
                  <p className="text-xl font-bold">฿1.2M</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ArrowUpIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <div>
                  <p className="text-xs text-white/80">ทรัพย์สินใหม่</p>
                  <p className="text-xl font-bold">+23</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <BuildingIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <div>
                  <p className="text-xs text-white/80">สมาชิกใหม่</p>
                  <p className="text-xl font-bold">+47</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MembersIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">เมนูด่วน</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{action.title}</p>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
