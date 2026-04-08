"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../admin/components/Sidebar";
import { AuthProvider, useAuth } from "@/lib/auth";
import LoginPage from "../admin/components/LoginPage";

const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}>({
  isOpen: true,
  setIsOpen: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

function SellerShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      router.replace("/admin");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
            <span className="text-white font-serif italic text-xl">S</span>
          </div>
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === "admin") {
    return null;
  }

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex min-h-screen bg-white text-neutral-900 selection:bg-black selection:text-white">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <main
          className={`flex-1 transition-all duration-300 ease-out ${
            isOpen ? "lg:ml-72" : "lg:ml-20"
          }`}
        >
          <div className="h-16 lg:hidden" />
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SellerShell>{children}</SellerShell>
    </AuthProvider>
  );
}
