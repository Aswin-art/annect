"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
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
    header: "EVENT PHOTO",
    cell: ({ row }) => (
      <Image
        src={row.original.events.image ?? ""}
        width={100}
        height={100}
        alt="image-background"
        className="object-cover rounded-md"
      />
    ),
  },
  {
    accessorFn: (row) => row.events.name,
    accessorKey: "name",
    header: "EVENT NAME",
  },
  {
    accessorKey: "users.email",
    header: "USER EMAIL",
  },
  {
    accessorKey: "users.name",
    header: "USER NAME",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "created_at",
    header: "REPORT DATE",
  },
];
