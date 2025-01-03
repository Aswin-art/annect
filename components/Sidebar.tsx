"use client";
import React, { useState } from "react";
import { DashboardNav } from "@/components/DashboardNav";
import { userNavItems } from "@/constants/data";
import { adminNavItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { useUser } from "@clerk/nextjs";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const { user } = useUser();
  const isAdmin =
    user?.emailAddresses[0].emailAddress ===
    "22081010099@student.upnjatim.ac.id";

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative hidden h-screen flex-none border-r z-10 pt-20 md:block`,
        status && "duration-500",
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            {isAdmin ? (
              <DashboardNav items={adminNavItems} />
            ) : (
              <DashboardNav items={userNavItems} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}