"use client";

import { useState, createContext, useContext } from "react";
import Sidebar from "./components/Sidebar";

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <main 
          className={`flex-1 transition-all duration-300 ease-out ${
            isOpen ? 'lg:ml-72' : 'lg:ml-20'
          }`}
        >
          {/* Spacer for mobile header */}
          <div className="h-16 lg:hidden" />
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
