"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { tags } from "@prisma/client";

interface ProductsClientProps {
  data: tags[];
}

export const TagTable: React.FC<ProductsClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Tags (${data.length})`}
          description="Kelola data tag."
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/tags/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Data
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
