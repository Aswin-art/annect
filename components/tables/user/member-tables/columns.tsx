"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { formatDate } from "@/lib/format";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "image",
    header: "PROFILE",
    cell: ({ row }) => {
      const imageUrl = row.original.users.image;
      return (
        <Image
          src={imageUrl ?? ""}
          alt="Profile"
          width={100}
          height={100}
          className="object-cover rounded-lg"
        />
      );
    },
  },
  {
    accessorKey: "users.name",
    header: "NAME",
  },
  {
    accessorFn: (row) => row.users.email,
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "status",
    header: "PEMBAYARAN",
    cell: ({ row }) => {
      const isLunas = row.original.status;
      return isLunas ? "Lunas" : "Belum Lunas";
    },
  },
  {
    accessorKey: "created_at",
    header: "TANGGAL MENGIKUTI",
    cell: ({ row }) => {
      return formatDate(row.original.created_at, true);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
