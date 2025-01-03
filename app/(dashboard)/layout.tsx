import { checkUser } from "@/actions/userActions";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Annect - Dashboard Page",
  description: "Dashboard Page",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkUser();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <>
      <Toaster />
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
