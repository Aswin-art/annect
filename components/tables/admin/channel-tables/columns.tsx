"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { channels } from "@prisma/client";
import Image from "next/image";

export const columns: ColumnDef<channels>[] = [
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
    header: "CHANNEL BACKGROUND",
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
    accessorKey: "users.name",
    header: "CREATOR",
  },
  {
    accessorKey: "users.email",
    header: "CREATOR EMAIL",
  },
  {
    accessorKey: "phone",
    header: "PHONE",
  },
  {
    accessorKey: "name",
    header: "CHANNEL NAME",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "created_at",
    header: "CREATED SINCE",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
