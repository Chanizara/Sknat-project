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

function StatCard({
  title,
  value,
  subtext,
  change,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtext: string;
  change: string;
  icon: React.ElementType;
}) {
  return (
    <div className="group bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 border border-neutral-100 bg-neutral-50/50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors duration-300">
          <Icon className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-100">
          <TrendingUpIcon className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[11px] font-semibold text-neutral-600">{change}</span>
        </div>
      </div>
      <div>
        <p className="text-neutral-500 text-xs tracking-wider uppercase mb-1.5">{title}</p>
        <p className="text-4xl font-light text-black tracking-tight mb-2">{value}</p>
        <p className="text-neutral-400 text-xs">{subtext}</p>
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
      title: "Sale Completed",
      description: "Lumpini Suite Condo - ฿3.2M",
      time: "5m ago",
    },
    {
      id: 2,
      icon: BuildingIcon,
      title: "New Property",
      description: "2-Story House, Suandok Village",
      time: "15m ago",
    },
    {
      id: 3,
      icon: ClockIcon,
      title: "Pending Contact",
      description: "Somchai Jaidee - Townhome #1234",
      time: "1h ago",
    },
    {
      id: 4,
      icon: MembersIcon,
      title: "New Member",
      description: "Somying Rakdee registered",
      time: "2h ago",
    },
  ];

  const quickActions = [
    { title: "Add Property", icon: BuildingIcon, href: "/admin/properties" },
    { title: "Review Orders", icon: ClipboardIcon, href: "/admin/orders" },
    { title: "Manage Members", icon: MembersIcon, href: "/admin/members" },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-black mb-1">
            Overview
          </h1>
          <p className="text-sm text-neutral-500 tracking-wide">
            Real Estate Management System
          </p>
        </div>
        <div className="flex items-center text-sm bg-neutral-50 px-4 py-2 border border-neutral-100 rounded-full">
          <span className="text-neutral-400 uppercase tracking-widest text-[10px] font-semibold mr-3">Date</span>
          <span className="text-black font-medium pb-0.5">Feb 24, 2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Staff" value={stats.totalUsers} subtext="System administrators" change="+5" icon={UserGroupIcon} />
        <StatCard title="Members" value={stats.totalMembers} subtext="Registered clients" change="+12" icon={MembersIcon} />
        <StatCard title="Assets" value={stats.totalProperties} subtext="Total properties" change="+8" icon={BuildingIcon} />
        <StatCard title="Orders" value={stats.pendingOrders} subtext="Pending transactions" change="+2" icon={ClipboardIcon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-black tracking-wide uppercase">Recent Activity</h2>
              <Link href="/admin/history" className="text-xs text-neutral-500 hover:text-black transition-colors uppercase tracking-widest bg-neutral-50 hover:bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-100">
                View All
              </Link>
            </div>
            <div className="p-2">
              <div className="divide-y divide-neutral-100/50">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-5 p-4 mx-2 my-1 hover:bg-neutral-50 rounded-2xl transition-all duration-300 group cursor-pointer">
                      <div className="w-12 h-12 border border-neutral-100/50 rounded-2xl flex items-center justify-center bg-white group-hover:border-black/10 group-hover:shadow-sm transition-all duration-300">
                        <Icon className="w-5 h-5 text-neutral-500 group-hover:text-black transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-black">{activity.title}</p>
                          <p className="text-xs text-neutral-500 mt-1">{activity.description}</p>
                        </div>
                        <span className="text-[10px] uppercase text-neutral-400 tracking-widest bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-100">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-8">
          {/* Highlight Box */}
          <div className="bg-black text-white p-8 rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] relative overflow-hidden">
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-8 relative z-10">Quick Stats</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Today's Sales</p>
                  <p className="text-3xl font-light tracking-tight">฿1.2M</p>
                </div>
                <div className="w-12 h-12 border border-white/10 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <ArrowUpIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">New Listings</p>
                  <p className="text-2xl font-light tracking-tight">+23</p>
                </div>
                <div className="w-12 h-12 border border-white/10 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <BuildingIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-black p-6 border-b border-neutral-100">Quick Actions</h3>
            <div className="p-3 space-y-1">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-2xl transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 border border-neutral-100/50 rounded-xl flex items-center justify-center bg-white group-hover:border-black/10 transition-colors">
                      <Icon className="w-4 h-4 text-neutral-500 group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-sm text-neutral-600 group-hover:text-black transition-colors font-medium">
                      {action.title}
                    </span>
                    <div className="flex-1" />
                    <span className="text-neutral-300 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all text-xs mr-2">→</span>
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