"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { events } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

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
    accessorKey: "channels.name",
    header: "CHANNEL",
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "tags.name",
    header: "TAG",
  },
  {
    accessorKey: "categories.name",
    header: "CATEGORY",
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
