"use client";
import { getAllData } from "@/actions/userEventAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PaymentTable } from "@/components/tables/admin/payment-tables/table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Withdraw Request", link: "/admin/user-payments" },
];

export default function Page() {
  const [userPayments, setUserPayments] = useState<any>([]);

  const getData = async () => {
    const req = await getAllData();
    console.log(req);
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

        <PaymentTable data={userPayments} />
      </div>
    </>
  );
}
