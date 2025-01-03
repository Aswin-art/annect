"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { events } from "@prisma/client";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";

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

export const columns: ColumnDef<UserEventType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "events.name",
    header: "EVENT",
  },
  {
    accessorKey: "events.price",
    header: "PRICE",
    cell: ({ row }) => (
      <span>
        {row.original.events.price > 0
          ? formatPrice(row.original.events.price)
          : "Gratis"}
      </span>
    ),
  },
  {
    accessorKey: "users.name",
    header: "USER",
  },
  {
    accessorKey: "created_at",
    header: "PAYMENT DATE",
    cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
  },
  {
    accessorKey: "tf_image",
    header: "PAYMENT IMAGE",
    cell: ({ row }) => (
      <>
        {row.original.tf_image && (
          <Link
            href={row.original.tf_image}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            View Image
          </Link>
        )}
      </>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
