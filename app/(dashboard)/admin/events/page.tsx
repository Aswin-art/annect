"use client";
import { getAllData, getAllDataAdmin } from "@/actions/eventAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EventTable } from "@/components/tables/admin/event-tables/table";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { events } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type EventType = {
  id: string;
  name: string;
  description: string;
  location: string;
  event_date: string;
  image: string;
  price: number;
  is_paid: boolean;
  is_online: boolean;
  is_favorite: boolean;
  categories?: {
    id: string;
    name: string;
  };
  tags?: {
    id: string;
    name: string;
  };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Event", link: "/admin/events" },
];

export default function Page() {
  const [events, setEvents] = useState<events[]>([]);

  const getData = async () => {
    const req = await getAllDataAdmin();
    console.log(req);
    setEvents(req);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <Separator />

        <EventTable data={events} key={"name"} />
      </div>
    </>
  );
}
