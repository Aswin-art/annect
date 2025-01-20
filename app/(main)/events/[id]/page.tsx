"use client";
import Wrapper from "@/components/Wrapper";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bookmark,
  CornerUpRight,
  GraduationCap,
  TriangleAlert,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  eventPayment,
  getEventById,
  updateUserEvent,
} from "@/actions/eventAction";
import { formatDate, formatPrice } from "@/lib/format";
import FallbackLoading from "@/components/Loading";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { eventPaymentDone, joinEvent } from "@/actions/userEventAction";
import {
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  RedditIcon,
  RedditShareButton,
  LineIcon,
  LineShareButton,
} from "react-share";
import { addFavorite } from "@/actions/favoriteAction";
import { addReport } from "@/actions/reportAction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  website_url: string;
  channels: {
    id: string;
    name: string;
    image: string;
    phone: string;
    users: {
      email: string;
      image: string;
    };
  };
  similar_event?: Array<{
    id: string;
    name: string;
    event_date: string;
    image: string;
  }>;
};

declare global {
  interface Window {
    snap: { pay: any };
  }
}

export default function Page({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const [events, setEvents] = useState<EventType>();
  const [reportDescription, setReportDescription] = useState("");
  const [isOpenReportDialog, setIsOpenReportDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const getEventDetail = async () => {
    const data = await getEventById(params.id);
    setEvents(data);
  };

  const router = useRouter();
  const pathname = usePathname();

  const handlePaymentDone = async (event_id: string) => {
    const req = await eventPaymentDone(event_id);

    if (req) {
      router.push(pathname);
      toast.success("Pembayaran Berhasil!");
      getEventDetail();
      setLoading(false);
    }
  };

  const handleJoinEvent = async (
    event_id: string,
    price: number,
    link_group: string
  ) => {
    setLoading(true);
    if (!user) return router.push("/sign-in");

    const data = {
      event: {
        id: event_id,
        link_group,
        price,
      },
      transaction_details: {
        gross_amount: price,
      },
      customer_details: {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        phone: user.phoneNumbers,
      },
      payment_type: "user_event",
    };

    try {
      if (typeof window === undefined) return;

      if (price <= 0) {
        const req = await joinEvent(event_id, price, link_group);

        if (req) {
          toast.success("Berhasil mengikuti!");
          await getEventDetail();
        } else {
          toast.error("Gagal mengikuti!");
        }
      } else {
        const req = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (req.ok) {
          const res = await req.json();
          const transaction_token = res.data.token;
          window.snap.pay(transaction_token, {
            onSuccess: () => handlePaymentDone(data.event.id),
            onClose: () => {
              toast.error("Harap selesaikan pembayaran anda!");
              setLoading(false);
            },
          });
        } else {
          toast.error("Network Error!");
          setLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Network Trouble!");
      setLoading(false);
      return null;
    }
  };

  const handleFavorite = async (eventId: string) => {
    const result = await addFavorite(eventId);

    if (result) {
      toast.success("Berhasil");
      await getEventDetail();
    } else {
      toast.error("Gagal");
    }
  };

  const handleReport = async (eventId: string) => {
    setReportLoading(true);
    if (!reportDescription || reportDescription === "") {
      toast.error("Harap isi deskripsi report!");
      setIsOpenReportDialog(false);
      setReportLoading(false);
      return;
    }

    const req = await addReport(eventId, reportDescription);

    if (req) {
      toast.success("Report berhasil dibuat!");
      setReportDescription("");
    }

    setIsOpenReportDialog(false);
    setReportLoading(false);
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
                        events?.channels.users.image ??
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
                  {events.is_join ? (
                    <Link
                      href={events.link_group}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants(),
                        "bg-green-500 hover:bg-green-600"
                      )}
                    >
                      Bergabung ke grub
                    </Link>
                  ) : (
                    <Button
                      onClick={() =>
                        handleJoinEvent(
                          events.id,
                          events.price,
                          events.link_group
                        )
                      }
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Ikuti Event"}
                    </Button>
                  )}
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

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="flex gap-4">
                        <div>
                          <TwitterShareButton
                            url={window.location.href}
                            title="Ayo ikut event ini bersamaku!"
                          >
                            <TwitterIcon size={32} round={true} />
                          </TwitterShareButton>
                        </div>
                        <div>
                          <LineShareButton
                            url={window.location.href}
                            title="Ayo ikut event ini bersamaku!"
                          >
                            <LineIcon size={32} round={true} />
                          </LineShareButton>
                        </div>
                        <div>
                          <WhatsappShareButton
                            url={window.location.href}
                            title="Ayo ikut event ini bersamaku!"
                          >
                            <WhatsappIcon size={32} round={true} />
                          </WhatsappShareButton>
                        </div>
                        <div>
                          <RedditShareButton
                            url={window.location.href}
                            title="Ayo ikut event ini bersamaku!"
                          >
                            <RedditIcon size={32} round={true} />
                          </RedditShareButton>
                        </div>
                      </div>
                      <div className="flex gap-4 w-full justify-end">
                        <Dialog open={isOpenReportDialog}>
                          <Button
                            onClick={() => setIsOpenReportDialog(true)}
                            variant={"destructive"}
                          >
                            <TriangleAlert /> Report Event
                          </Button>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Laporan Event</DialogTitle>
                              <DialogDescription>
                                Laporkan event jika ditemukan indikasi
                                kecurangan yang dilakukan oleh penyelenggara.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Label htmlFor="name">Deskripsi Laporan</Label>
                              <Textarea
                                id="name"
                                value={reportDescription}
                                onChange={(e) =>
                                  setReportDescription(e.target.value)
                                }
                                placeholder="Tulis deskripsi dari laporanmu...."
                                disabled={reportLoading}
                              />
                            </div>
                            <DialogFooter>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant={"secondary"}
                                  onClick={() => setIsOpenReportDialog(false)}
                                >
                                  Close
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={reportLoading}
                                  onClick={() => handleReport(events.id)}
                                >
                                  {reportLoading ? "Loading..." : "Submit"}
                                </Button>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="description" className="space-y-4">
                    <h2 className="font-semibold text-3xl">Detail Acara</h2>
                    <p>
                      Tanggal Pelaksanaan:{" "}
                      {formatDate(events?.event_date, true)}
                    </p>
                    <p>Lokasi Acara: {events?.location}</p>
                    <p>
                      Harga Acara:{" "}
                      {events?.price == 0
                        ? "Gratis"
                        : formatPrice(events?.price)}
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
                              {events.channels.users.email}
                            </p>
                          </div>
                          <div>
                            <Link
                              href={events.website_url}
                              target="_blank"
                              className="underline text-primary text-md"
                            >
                              Kunjungi Halaman Website / Sosial Media
                            </Link>
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
                            onClick={() => handleFavorite(event.id)}
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
