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
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DatetimePicker } from "@/components/ui/extension/datetime-picker";

import { addDays, format, setHours, setMinutes, setSeconds } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { tags } from "@prisma/client";
import { createEvents } from "@/actions/eventAction";
import dynamic from "next/dynamic";
import { ethers } from "ethers";
import ABI from "@/constants/abi.json";
const EditableEditor = dynamic(() => import("@/components/EditableEditor"), {
  ssr: false,
});

const DEFAULT_ADDRESS_URL = process.env.NEXT_PUBLIC_WEB3_ADDRESS_URL ?? "";
const DEFAULT_CHAIN_ID = BigInt(17000);

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Channels", link: "/users/channels" },
  { title: "Create Events", link: "/users/channels/events/create" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be exists.",
  }),
  description: z.string().min(2, {
    message: "description must be exists.",
  }),
  image: z.string().min(2, {
    message: "image must be exists.",
  }),
  tag_id: z.string().min(2, {
    message: "tag must be exists.",
  }),
  capacity: z.coerce.number().min(10),
  location: z.string(),
  price: z.coerce.number().min(1),
  event_date: z.coerce.date(),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      event_date: new Date(),
      image: "",
      location: "",
      name: "",
      price: 0,
      tag_id: "",
    },
  });

  const [tags, setTags] = useState<tags[]>([]);

  const router = useRouter();

  const isLoading = form.formState.isSubmitting;

  const getWebThree = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("Ethereum provider tidak ditemukan. Install MetaMask.");
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== DEFAULT_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.toQuantity(DEFAULT_CHAIN_ID) }],
          });
        } catch (switchError: unknown) {
          if (isSwitchError(switchError)) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: ethers.toQuantity(DEFAULT_CHAIN_ID),
                      chainName: "Holesky Testnet",
                      nativeCurrency: {
                        name: "Ethereum",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      rpcUrls: ["https://rpc.holesky.io"],
                      blockExplorerUrls: ["https://explorer.holesky.io"],
                    },
                  ],
                });
              } catch (addError) {
                console.error("Gagal menambahkan jaringan Holesky:", addError);
                alert(
                  "Gagal menambahkan jaringan Holesky. Ganti jaringan secara manual."
                );
                return null;
              }
            } else {
              console.error("Gagal mengganti jaringan:", switchError);
              alert("Gagal mengganti jaringan. Ganti jaringan secara manual.");
              return null;
            }
          } else {
            console.error(
              "Error tidak diketahui saat mengganti jaringan:",
              switchError
            );
            alert(
              "Terjadi error yang tidak diketahui. Ganti jaringan secara manual."
            );
            return null;
          }
        }
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

  function isSwitchError(error: unknown): error is { code: number } {
    return typeof error === "object" && error !== null && "code" in error;
  }

  const dateToWei = (date: Date): string => {
    const timestamp = Math.floor(date.getTime() / 1000);
    return ethers.parseUnits(timestamp.toString(), "wei").toString();
  };

  const convertToWei = async (usdAmount: number) => {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    try {
      const response = await fetch(url);
      const data = await response.json();
      const ethPriceInUSD = data.ethereum.usd;

      const ethAmount = usdAmount / ethPriceInUSD;
      const ethAmountRounded = ethAmount.toFixed(5);

      const ethInWei = ethers.parseEther(ethAmountRounded.toString());

      return ethInWei;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      alert("Failed to fetch Ethereum price from CoinGecko.");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const tomorrow = setSeconds(
      setMinutes(setHours(addDays(new Date(), 1), 0), 0),
      0
    );

    if (values.event_date < tomorrow) {
      toast.error("Tanggal event harus minimal besok!");
      return false;
    }

    const webThree = await getWebThree();

    if (!webThree) {
      toast.error("Error connecting to wallet!");
      return false;
    }

    try {
      const weiTimestamp = dateToWei(values.event_date);

      const priceInWei = await convertToWei(values.price);

      const data = {
        _name: values.name,
        _date: weiTimestamp,
        _priceETHWei: priceInWei,
        _priceUSD: values.price,
        _capacity: values.capacity,
      };

      const web = await webThree.contract.createEvent(
        data._name,
        data._date,
        data._priceUSD,
        data._capacity
      );

      if (!web.data) {
        toast.error("Error to create contract!");
        return false;
      }

      const create = await createEvents(values);
     
      if (create) {
        toast.success("Success!");
        router.push("/users/channels");
      } else {
        toast.error("Failed!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error network!");
      return false;
    }
  };

  useEffect(() => {
    const getTags = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`);
        const res = await req.json();
        if (res.length > 0) {
          setTags(res);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    getTags();
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Buat Event Baru`}
            description="Lengkapi form untuk menambahkan event baru"
          />
        </div>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster Event</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="image"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Event</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiket Tersedia</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} type="number" {...field} />
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
                  <FormLabel>Deskripsi Event</FormLabel>
                  <FormControl>
                    <EditableEditor
                      onChange={field.onChange}
                      value={field.value}
                      editable={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Event</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Event</FormLabel>
                    <DatetimePicker
                      {...field}
                      format={[
                        ["months", "days", "years"],
                        ["hours", "minutes", "am/pm"],
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi Event</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tag_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag / Tipe Event</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id}>
                              {tag.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="mt-5" />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
