"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { events } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<events>[] = [
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
    accessorKey: "image",
    header: "EVENT PHOTO",
    cell: ({ row }) => (
      <Image
        src={row.original.image ?? ""}
        width={100}
        height={100}
        alt="image-background"
        className="object-cover rounded-md"
      />
    ),
  },
  {
    accessorKey: "channels.name",
    header: "PUBLISHER",
  },
  {
    accessorKey: "name",
    header: "EVENT NAME",
  },
  {
    accessorKey: "price",
    header: "EVENT PRICE",
  },
  {
    accessorKey: "post_duration",
    header: "POST DURATION",
  },
  {
    accessorKey: "event_date",
    header: "EVENT DATE",
  },
  {
    accessorKey: "tags.name",
    header: "EVENT TAG",
  },
  {
    accessorKey: "categories.name",
    header: "EVENT CATEGORY",
  },
  {
    accessorKey: "price",
    header: "PRICE",
    cell: ({ row }) => (
      <span>
        {row.original.price && row.original.price > 0
          ? formatPrice(row.original.price)
          : "Gratis"}
      </span>
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
