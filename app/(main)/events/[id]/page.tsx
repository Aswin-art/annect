"use client";
import Wrapper from "@/components/Wrapper";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, CornerUpRight, GraduationCap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getEventById } from "@/actions/eventAction";
import { channels, events } from "@prisma/client";
import { formatDate, formatPrice } from "@/lib/format";
import FallbackLoading from "@/components/Loading";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { buyTicket } from "@/actions/ticketAction";
import ABI from "@/constants/abi.json";
import { ethers } from "ethers";

const DEFAULT_ADDRESS_URL = process.env.NEXT_PUBLIC_WEB3_ADDRESS_URL ?? "";
const DEFAULT_CHAIN_ID = BigInt(17000);

type EventType = {
  id: string;
  name: string;
  description: string;
  event_date: string;
  image: string;
  location: string;
  price: number;
  is_join: boolean;
  link_group: string;
  channels: {
    id: string;
    name: string;
    image: string;
    phone: string;
    email: string;
  };
  similar_event?: Array<{
    id: string;
    name: string;
    event_date: string;
    image: string;
  }>;
};

export default function Page({ params }: { params: { id: string } }) {
  const [events, setEvents] = useState<EventType>();
  const [amountTicket, setAmountTicket] = useState(0);
  const [loading, setLoading] = useState(false);
  const getEventDetail = async () => {
    const data = await getEventById(params.id);
    setEvents(data);
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

  const handlebuyTicket = async () => {
    setLoading(true);

    if (amountTicket <= 0) {
      toast.error("Ticket harus minimal 1");
      return false;
    }

    if (!events) {
      toast.error("Tidak ada event yang tersedia!");
      return false;
    }

    const webThree = await getWebThree();

    if (!webThree) {
      toast.error("Error connecting to wallet!");
      return false;
    }

    const eventDetails = await webThree.contract.events(events.id);
    let ticketPrice = eventDetails.priceETHWei;
    const ticketPriceInETH = ethers.formatEther(ticketPrice);
    const ticketPriceAsNumber = parseFloat(ticketPriceInETH);
    const totalPrice: number = ticketPriceAsNumber * amountTicket;
    const etherFinalPrice = ethers.parseUnits(totalPrice.toString(), 18);

    try {
      await webThree.contract.buyTicketWithETH(0, amountTicket, {
        value: etherFinalPrice,
      });

      const ticket = await buyTicket(amountTicket, Number(events.id));
      if (ticket) {
        toast.success("Success buy ticket!");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to buy ticket!");
    }

    setLoading(false);
  };

  const handleFavorite = async () => {
    toast.success("Berhasil disimpan!");
  };

  useEffect(() => {
    getEventDetail();
  }, []);

  return (
    <Wrapper>
      <div className="mt-40">
        {events ? (
          <>
            <div className="relative h-[500px] mb-10">
              <Image
                src={events?.image || ""}
                alt="Poster dummy"
                fill
                sizes="100%"
                className="object-cover rounded-lg"
              />
            </div>
            <div className="mt-10 mb-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={
                        events?.channels.image ??
                        "https://github.com/shadcn.png"
                      }
                      fill
                      sizes="100%"
                      alt="avatar"
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={"/channels/" + events?.channels.id}
                      className="font-bold text-xl hover:text-primary"
                    >
                      {events?.channels?.name}
                    </Link>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/events/${events.id}/discussions`}
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        className: "hover:text-primary",
                      })
                    )}
                  >
                    Ruang Diskusi
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Beli Tiket</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Pembelian Tiket</DialogTitle>
                        <DialogDescription>
                          Masukkan jumlah tiket yang diinginkan.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Tiket
                          </Label>
                          <Input
                            id="name"
                            type="number"
                            className="col-span-3"
                            onChange={(e) =>
                              setAmountTicket(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handlebuyTicket} disabled={loading}>
                          {loading ? "loading..." : "Save changes"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 ">
                <Tabs defaultValue="events" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="events">Deskripsi</TabsTrigger>
                    <TabsTrigger value="description">Informasi</TabsTrigger>
                    <TabsTrigger value="contact">Kontak</TabsTrigger>
                  </TabsList>
                  <TabsContent value="events" className="space-y-4">
                    <h2 className="font-bold text-3xl">{events?.name}</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: events?.description ?? "",
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="description" className="space-y-4">
                    <h2 className="font-semibold text-3xl">Detail Acara</h2>
                    <p>Tanggal Pelaksanaan: {formatDate(events?.event_date)}</p>
                    <p>Lokasi Acara: {events?.location}</p>
                    <p>
                      Harga Acara:{" "}
                      {events?.price == 0
                        ? "Gratis"
                        : formatPrice(events?.price, "USD")}
                    </p>
                  </TabsContent>
                  <TabsContent value="contact" className="space-y-4">
                    <div className="flex flex-col">
                      <h2 className="font-semibold text-3xl mb-8">
                        Hubungi Penyelenggara Acara
                      </h2>
                      <div className="border border-slate-200 p-6 rounded-lg mb-8">
                        <div className="flex items-center mb-8">
                          <Image
                            src={events?.channels.image ?? ""}
                            width={50}
                            height={50}
                            alt="logo"
                            className="mr-4"
                          ></Image>
                          <h2 className="text-semibold text-3xl">
                            {events?.channels.name}
                          </h2>
                        </div>
                        <Separator className="mb-8" />
                        <div className="flex flex-col text-xl gap-5 ml-5">
                          <div>
                            <h5>No. Telepon</h5>
                            <p className="font-semibold">
                              {events?.channels.phone}
                            </p>
                          </div>
                          <div>
                            <h5>Alamat Email</h5>
                            <p className="font-semibold">
                              {events.channels.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="bg-primary rounded-lg mt-5">
                  <Link
                    href="/events"
                    className="flex items-center justify-start"
                  >
                    <div className="relative h-[150px] p-3 mr-5">
                      <GraduationCap className="w-full h-full text-white" />
                    </div>
                    <div className="flex flex-col items-start mr-10">
                      <h4 className="text-2xl font-bold text-white">
                        Tidak tertarik dengan event ini ?
                      </h4>
                      <p className="text-2xl font-medium text-white">
                        Lihat event lainnya
                      </p>
                    </div>
                    <div className="relative h-[45px] ml-auto mr-10">
                      <CornerUpRight className="w-full h-full text-white" />
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="flex justify-between gap-4 items-center">
                  <h2 className="font-semibold text-2xl">Acara Serupa</h2>
                  <Link
                    href={"/events"}
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        className: "hover:text-primary",
                      })
                    )}
                  >
                    Lainnya
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mt-5">
                  {events?.similar_event?.map((event) => (
                    <Card
                      key={event.id}
                      className="group hover:-translate-y-3 hover:border-primary transition-all duration-300"
                    >
                      <div className="relative w-full h-[200px]">
                        <Link href={"/events/" + event.id}>
                          <Image
                            src={event.image || ""}
                            alt="image"
                            width={0}
                            height={0}
                            fill
                            sizes="100%"
                            loading="lazy"
                            className="object-cover w-full h-full rounded-t-lg"
                          />
                        </Link>
                      </div>
                      <CardHeader>
                        <CardTitle>
                          <Link
                            href={"/events/" + event.id}
                            className="hover:text-primary transition-all duration-200"
                          >
                            {event.name}
                          </Link>
                        </CardTitle>
                        {/* <CardDescription className="max-w-lg">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: event.description
                                ? event.description.length > 100
                                  ? `${event.description.slice(0, 100)}...`
                                  : event.description
                                : "",
                            }}
                          />
                        </CardDescription> */}
                      </CardHeader>
                      <CardFooter>
                        <div className="flex gap-2 ms-auto">
                          <Link href={"/events/" + event.id}>
                            <Button
                              variant={"secondary"}
                              className="hover:text-primary transition-all duration-300"
                            >
                              Lihat detail
                            </Button>
                          </Link>
                          <Button
                            variant={"ghost"}
                            onClick={handleFavorite}
                            className="hover:text-white text-primary hover:bg-primary transition-all duration-200"
                          >
                            <Bookmark />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <FallbackLoading />
        )}
      </div>
    </Wrapper>
  );
}
