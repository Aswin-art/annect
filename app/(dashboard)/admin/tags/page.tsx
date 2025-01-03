"use client";
import { getAllData } from "@/actions/tagAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TagTable } from "@/components/tables/admin/tag-tables/table";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { tags } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Tags", link: "/admin/tags" },
];

export default function Page() {
  const [tags, setTags] = useState<tags[]>([]);

  const getData = async () => {
    const req = await getAllData();

    setTags(req);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <Separator />

      <TagTable data={tags} key={"name"} />
    </div>
  );
}
