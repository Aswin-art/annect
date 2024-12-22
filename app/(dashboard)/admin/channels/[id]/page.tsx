"use client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import ABI from "@/constants/abi.json";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { channelVerification, getChannelById } from "@/actions/channelAction";
import { ethers } from "ethers";
const EditableEditor = dynamic(() => import("@/components/EditableEditor"), {
  ssr: false,
});

const DEFAULT_ADDRESS_URL = process.env.NEXT_PUBLIC_WEB3_ADDRESS_URL ?? "";
const DEFAULT_CHAIN_ID = BigInt(17000);

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Channels", link: "/admin/channels" },
  { title: "Detail", link: "/admin/channels/" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  image: z.string().min(2, {
    message: "Image must be exists.",
  }),
  email: z.string().min(2, {
    message: "Email must be exists.",
  }),
  nik: z.coerce.number({
    message: "NIK must be exists.",
  }),
  ktp_photo: z.string().min(2, {
    message: "KTP Photo must be exists.",
  }),
  phone: z.string().min(2, {
    message: "Phone must be exists.",
  }),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getChannelData = async () => {
    const req = await getChannelById(params.id as string);

    if (req) {
      form.reset(req);
    }
  };

  const getWebThree = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("Ethereum provider tidak ditemukan. Install MetaMask.");
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const network = await provider.getNetwork();
      if (network.chainId !== DEFAULT_CHAIN_ID) {
        alert(`Silakan pindah ke jaringan Holesky`);
        throw new Error(
          `Jaringan yang aktif adalah Chain ID: ${network.chainId}, bukan ${DEFAULT_CHAIN_ID}.`
        );
      }

      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(DEFAULT_ADDRESS_URL, ABI, signer);

      return { provider, signer, contract };
    } catch (error) {
      console.error("Error setting up provider, signer, or contract:", error);
      return null;
    }
  };

  const verifiedChannel = async () => {
    setIsLoading(true);
    const webThree = await getWebThree();

    if (!webThree) {
      toast.error("Failed to verify!");
      setIsLoading(false);
      return false;
    }

    try {
      const req = await channelVerification(params.id as string);

      if (req) {
        webThree.contract.addWhitelistedCreator(req.users?.wallet_address);
        toast.success("Success to verified!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to verify!");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getChannelData();
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Detail Channel`}
            description="Berikut merupakan data lengkap dari channel."
          />
        </div>
        <Separator />

        <Form {...form}>
          <form onSubmit={() => console.log("keren")} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Channel</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="image"
                        onChange={field.onChange}
                        value={field.value}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ktp_photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KTP Photo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="image"
                        onChange={field.onChange}
                        value={field.value}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Channel</FormLabel>
                    <FormControl>
                      <Input disabled={true} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Penyelenggara</FormLabel>
                    <FormControl>
                      <Input disabled={true} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Channel</FormLabel>
                  <FormControl>
                    <EditableEditor
                      onChange={field.onChange}
                      value={field.value}
                      editable={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK (Nomor Induk Kewarganegaran)</FormLabel>
                    <FormControl>
                      <Input disabled={true} type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input disabled={true} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              onClick={verifiedChannel}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Verifikasi"}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
