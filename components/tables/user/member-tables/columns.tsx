"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/constants/data";
import Image from "next/image";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "image",
    header: "PROFILE",
    cell: ({ row }) => {
      const imageUrl = row.original.image;
      return (
        <Image
          src={imageUrl ?? ""}
          alt="Profile"
          width={100}
          height={100}
          className="object-cover rounded-full"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "email",
    header: "TANGGAL MENGIKUTI",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
