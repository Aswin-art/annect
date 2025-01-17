"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import Image from "next/image";

export const columns: ColumnDef<any>[] = [
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
    accessorKey: "events.image",
    header: "EVENT IMAGE",
    cell: ({ row }) => (
      <Image
        src={row.original.events.image}
        width={100}
        height={100}
        alt="event-image"
        className="object-cover rounded-md"
      />
    ),
  },
  {
    accessorKey: "events.name",
    header: "EVENT",
  },
  {
    accessorKey: "users.email",
    header: "EMAIL USER",
  },
  {
    accessorKey: "amount",
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
    accessorKey: "created_at",
    header: "WITHDRAW DATE",
    cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
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
