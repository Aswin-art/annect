"use client";
import { getAllData } from "@/actions/channelAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChannelTable } from "@/components/tables/admin/channel-tables/table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { channels } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Channel", link: "/admin/channels" },
];

export default function Page() {
  const [channels, setChannels] = useState<any[]>([]);

  const getData = async () => {
    const req = await getAllData();
    setChannels(req);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <Separator />

        <ChannelTable data={channels} key={"name"} />
      </div>
    </>
  );
}
