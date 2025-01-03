"use client";
import { getAllData } from "@/actions/userEventAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PaymentTable } from "@/components/tables/admin/payment-tables/table";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { events } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "User Payment", link: "/admin/user-payments" },
];

export default function Page() {
  const [userPayments, setUserPayments] = useState([]);

  const getData = async () => {
    const req = await getAllData();
    setUserPayments(req);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <Separator />

        <PaymentTable data={userPayments} key={"name"} />
      </div>
    </>
  );
}
