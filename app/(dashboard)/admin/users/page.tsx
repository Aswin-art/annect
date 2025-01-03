"use client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { UserTable } from "@/components/tables/admin/user-tables/table";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllData } from "@/actions/userActions";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Users", link: "/admin/users" },
];

export default function Page() {
  const [users, setUsers] = useState([]);
  const getData = async () => {
    const req = await getAllData();
    setUsers(req);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <Separator />

      <UserTable data={users} key={"email"} />
    </div>
  );
}
