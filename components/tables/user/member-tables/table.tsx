"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./columns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductsClientProps {
  data: any[];
}

export const MemberTable: React.FC<ProductsClientProps> = ({ data }) => {
  const pathname = usePathname();
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Daftar List Member (${data.length})`} description="" />
        <Link
          href={pathname + "/broadcast"}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus />
          Broadcast Member
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="email" columns={columns} data={data} />
    </>
  );
};
