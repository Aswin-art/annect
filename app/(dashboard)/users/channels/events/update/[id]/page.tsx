"use client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { format } from "date-fns";
import EditableEditor from "@/components/EditableEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { tags } from "@prisma/client";
import { cancelEvent, getEventById } from "@/actions/eventAction";
import Link from "next/link";
import FallbackLoading from "@/components/Loading";
import { ethers } from "ethers";
import ABI from "@/constants/abi.json";

const DEFAULT_ADDRESS_URL = process.env.NEXT_PUBLIC_WEB3_ADDRESS_URL ?? "";
const DEFAULT_CHAIN_ID = BigInt(17000);

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Channels", link: "/users/channels" },
  { title: "Update Events", link: "/users/channels/events/update" },
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
  location: z.string().min(2, {
    message: "location must be exists.",
  }),
  price: z.coerce.number().min(0),
  event_date: z.date(),
  capacity: z.coerce.number().min(0),
});

export default function Page({ params }: { params: { id: string } }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [tags, setTags] = useState<tags[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  const createHandler = async (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
    try {
      const req = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/events/" + params.id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (req.ok) {
        toast.success("Success!");
        router.push("/users/channels");
      } else {
        const errorData = await req.json();
        toast.error(`Failed! ${errorData.message || "Unknown error"}`);
        console.error("Server error:", errorData);
      }
    } catch (err) {
      toast.error("Failed!");
      console.error("Network error:", err);
    }
  };

  const getData = async () => {
    const req = await getEventById(params.id);
    if (req) {
      form.setValue("name", req?.name);
      form.setValue("image", req?.image);
      form.setValue("description", req?.description);
      form.setValue("price", req?.price);
      form.setValue("event_date", req?.event_date);
      form.setValue("location", req?.location);
      form.setValue("tag_id", req?.tag_id);
      form.setValue("capacity", req?.capacity);
      setLoading(false);
    }
  };

  const dateToWei = (date: Date): string => {
    const timestamp = Math.floor(date.getTime() / 1000);
    return ethers.parseUnits(timestamp.toString(), "wei").toString();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const webThree = await getWebThree();
    if (!webThree) {
      toast.error("Error connecting to wallet!");
      return false;
    }

    try {
      const weiTimestamp = dateToWei(values.event_date);

      const data = {
        _eventID: params.id,
        _newDate: weiTimestamp,
        _newPriceUSD: values.price,
        _newCapacity: values.capacity,
      };

      const web = await webThree.contract.editEvent(
        data._eventID,
        data._newDate,
        data._newPriceUSD,
        data._newCapacity
      );

      console.log("web", web);
      if (!web.data) {
        console.log("error web data")
        toast.error("Error to create contract!");
        return false;
      }

      await createHandler(values);
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        if ("reason" in err) {
          toast.error((err as any).reason);
          return false;
        }
      }
      toast.error("Error network!");
      return false;
    }
  };

  const handleCancel = async () => {
    const webThree = await getWebThree();
    if (!webThree) {
      toast.error("Error connecting to wallet!");
      return false;
    }

    try {
      const data = {
        _eventId: Number(params.id),
      };

      const web = await webThree.contract.cancelEvent(data._eventId);
      if (!web.data) {
        toast.error("Error to create contract!");
        return false; 
      }

      await cancelEvent(Number(params.id));
      toast.success("Success!");
      router.push("/users/channels");
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        if ("reason" in err) {
          toast.error((err as any).reason);
          return false;
        }
      }
      toast.error("Error network!");
      return false;
    }
  }

  useEffect(() => {
    const getTags = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`);
        const res = await req.json();
        const tags = res.map((tag: { id: string; name: string }) => ({
          id: tag.id,
          name: tag.name,
        }));
        setTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    getTags();
    getData();
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Update Event`}
            description="Lengkapi form untuk mengupdate event."
          />
        </div>
        <Separator />

        {loading ? (
          <FallbackLoading />
        ) : (
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Event</FormLabel>
                    <FormControl>
                      <EditableEditor
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
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
                      <FormControl>
                        <div className="relative">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                            {tags?.map((tag, index) => (
                              <SelectItem key={index} value={tag.id}>
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
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} type="number" {...field} />
                      </FormControl>
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
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                  <Button type="button" variant={`destructive`} disabled={isLoading} onClick={handleCancel}>
                    Cancel Event
                  </Button>
              </div>
              <Separator className="mt-5" />
              <div className="flex gap-2">
                <Link
                  href={"/users/channels"}
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      className: "text-primary",
                    })
                  )}
                >
                  Kembali
                </Link>
                <Button type="submit" disabled={isLoading} onClick={handleCancel}>
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </ScrollArea>
  );
}
