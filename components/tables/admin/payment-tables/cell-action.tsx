"use client";
import { updateUserEvent } from "@/actions/eventAction";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { events } from "@prisma/client";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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

interface CellActionProps {
  data: UserEventType;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    const req = await updateUserEvent(
      data.id,
      data.tf_image,
      true,
      data.events.link_group
    );

    if (req) {
      toast.success("Success!");
      window.location.reload();
    } else {
      toast.error("Failed!");
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      {data.status == 0 && data.events.price > 0 && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Verifikasi Pembayaran
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
