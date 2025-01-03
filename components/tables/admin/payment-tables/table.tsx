"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { events } from "@prisma/client";

type EventType = {
  id: string;
  name: string;
  image: string;
  price: number;
  link_group: string;
};

type UserType = {
  id: string;
  name: string;
  image: string;
};

type UserEventType = {
  id: string;
  user_id: string;
  event_id: string;
  tf_image: string;
  status: number;
  created_at: Date;
  events: EventType;
  users: UserType;
};

interface ProductsClientProps {
  data: UserEventType[];
}

export const PaymentTable: React.FC<ProductsClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Payment User (${data.length})`}
          description="Kelola data event."
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
