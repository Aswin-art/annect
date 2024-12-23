"use client";
import { getAllChannelForAdmin } from "@/actions/channelAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChannelTable } from "@/components/tables/admin/channel-tables/table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Channel", link: "/admin/channels" },
];

export default function Page() {
  const [channels, setChannels] = useState([]);

  const getData = async () => {
    const req = await getAllChannelForAdmin();
    setChannels(req);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <Separator />

      <ChannelTable data={channels} key={"name"} />
    </div>
  );
}
