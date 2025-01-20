"use client";
import { getChannelByUserId } from "@/actions/channelAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import FallbackLoading from "@/components/Loading";
import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { channels_status, events, follows, users } from "@prisma/client";
import { Plus, UserRoundPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { eventPayment } from "@/actions/eventAction";
import { useUser } from "@clerk/nextjs";
import EditableEditor from "@/components/EditableEditor";

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Channel", link: "/users/channels" },
];

type ChannelUser = {
  id: string;
  image: string;
  name: string | null;
  description: string | null;
  status: channels_status;
  users: users | null;
  events: events[] | null;
  follows: follows[] | null;
};

export default function Page() {
  const { user } = useUser();
  const [channels, setChannels] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [paymentImage, setPaymentImage] = useState<string | undefined>("");
  const getData = async () => {
    const req = await getChannelByUserId();
    setChannels(req);
    setLoading(false);
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleCheckChannelVerification = () => {
    setIsChecking(true);
    if (channels?.status === "VERIFIED") {
      router.push("/users/channels/events/create");
    } else {
      toast.error("Tunggu diverifikasi oleh admin!");
    }
    setIsChecking(false);
  };

  const handlePaymentDone = async (event_id: string) => {
    const req = await eventPayment(event_id);

    if (req) {
      router.push(pathname);
      toast.success("Pembayaran Berhasil!");
      getData();
      setLoading(false);
    }
  };

  const handleEventPayment = async (
    event_id: string,
    price: number,
    link_group: string
  ) => {
    setPaymentLoading(true);
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
      payment_type: "event",
    };

    try {
      if (typeof window === undefined) return;

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
            setPaymentLoading(false);
          },
        });
      } else {
        toast.error("Payment Error!");
        setPaymentLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Network Error!");
      setPaymentLoading(false);
      return null;
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Suspense fallback={<Loading />}>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
          <Breadcrumbs items={breadcrumbItems} />
          {loading ? (
            <FallbackLoading />
          ) : (
            <>
              {channels ? (
                <>
                  <div className="relative h-[300px]">
                    <Image
                      src={channels?.image || ""}
                      fill
                      alt="background"
                      sizes="100%"
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="mt-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-40 h-40">
                          <AvatarImage src={channels?.users?.image || ""} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-2xl">
                            {channels?.name}
                          </h3>
                          <div className="flex gap-2">
                            <p className="text-muted-foreground text-sm">
                              {channels?.users?.name}
                            </p>
                            <p className="text-muted-foreground text-sm">|</p>
                            <p className="text-muted-foreground text-sm">
                              {channels?.follows?.length ?? 0} Followers
                            </p>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {channels?.events?.length ?? 0} Event
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={"secondary"}
                          className="hover:text-primary"
                          onClick={handleCheckChannelVerification}
                          disabled={isChecking}
                        >
                          <Plus className="mr-2 h-4 w-4" />{" "}
                          {isChecking ? "Loading..." : "Tambah Event"}
                        </Button>
                        <Link
                          href={"/users/channels/update/" + channels?.id}
                          className={cn(buttonVariants({ variant: "default" }))}
                        >
                          <UserRoundPen className="mr-2 h-4 w-4" /> Edit Channel
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <Tabs defaultValue="events" className="space-y-4 mt-4">
                    <TabsList>
                      <TabsTrigger value="events">Daftar Event</TabsTrigger>
                      <TabsTrigger value="description">Deskripsi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events" className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {channels?.events?.map((event: any, index: number) => (
                          <Card
                            key={index}
                            className="group hover:-translate-y-3 hover:border-primary transition-all duration-300"
                          >
                            <div className="relative w-full h-[300px]">
                              <Image
                                src={event.image || ""}
                                alt="image"
                                fill
                                sizes="100%"
                                loading="lazy"
                                className="object-cover w-full h-full rounded-t-lg"
                              />
                            </div>
                            <CardHeader>
                              <CardTitle>
                                <div className="flex w-full justify-between items-center">
                                  {event.name}
                                  {event.status == "ONGOING" && (
                                    <Button variant={"secondary"} disabled>
                                      Event Berjalan
                                    </Button>
                                  )}

                                  {event.status == "DONE" && (
                                    <Button variant={"secondary"} disabled>
                                      Event Telah Berakhir
                                    </Button>
                                  )}

                                  {event.status == "PENDING" && (
                                    <Button
                                      variant={"secondary"}
                                      onClick={() =>
                                        handleEventPayment(
                                          event.id,
                                          event.post_duration * 500,
                                          event.link_group
                                        )
                                      }
                                      disabled={paymentLoading}
                                      className="hover:text-primary"
                                    >
                                      {paymentLoading
                                        ? "Loading..."
                                        : "Bayar Event"}
                                    </Button>
                                  )}
                                </div>
                              </CardTitle>
                              <CardDescription className="max-w-lg">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: event.description
                                      ? event.description.length > 100
                                        ? `${event.description.slice(
                                            0,
                                            100
                                          )}...`
                                        : event.description
                                      : "",
                                  }}
                                />
                              </CardDescription>
                            </CardHeader>
                            <CardFooter>
                              <div className="ms-auto flex gap-2">
                                <Link href={"/events/" + event.id}>
                                  <Button
                                    variant={"secondary"}
                                    className="hover:text-primary transition-all duration-300"
                                  >
                                    Lihat detail
                                  </Button>
                                </Link>
                                <Link
                                  href={
                                    "/users/channels/events/dashboard/" +
                                    event.id
                                  }
                                >
                                  <Button variant={"default"}>
                                    Analitik Event
                                  </Button>
                                </Link>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="description" className="space-y-4">
                      <EditableEditor
                        onChange={() => {}}
                        value={channels.description}
                        editable={false}
                      />
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="border-2 border-dotted rounded-lg mt-10 h-[200px] flex justify-center items-center">
                  <Link
                    href={"/users/channels/create"}
                    className={cn(buttonVariants({ variant: "default" }))}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Buat Channel
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </Suspense>
  );
}
