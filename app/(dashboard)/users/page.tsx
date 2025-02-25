"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Clock,
  Heart,
  LayoutGrid,
  MapPin,
  Tag,
  UserRound,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { getUserDashboardData } from "@/actions/userActions";
import { categories, channels, events, tags, users } from "@prisma/client";
import Loading from "@/components/Loading";
import { formatDate, formatPrice } from "@/lib/format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import { updateUserEvent } from "@/actions/eventAction";
import { followChannel } from "@/actions/followAction";
import { addFavorite } from "@/actions/favoriteAction";

type EventType = {
  id: string;
  name: string;
  image: string;
  description: string;
  event_date: Date;
  price: number;
  is_online: boolean;
  is_paid: boolean;
  link_group: string;
  tags: tags;
  categories: categories;
  channels: channels;
};

type UserEventType = {
  id: string;
  status: boolean;
  events: EventType;
  users: users;
};

type ChannelType = {
  id: string;
  name: string;
  image: string;
  description: string;
  created_at: Date;
  users: users;
  _count: {
    events: number;
  };
};

type FollowType = {
  id: string;
  channels: ChannelType;
};

type FavoriteType = {
  id: string;
  events: EventType;
};

type DashboardType = {
  user_events: UserEventType[];
  follows: FollowType[];
  favorites: FavoriteType[];
};

export default function Page() {
  const { user } = useUser();
  const [dashboard, setDashboard] = useState<DashboardType>({
    user_events: [],
    follows: [],
    favorites: [],
  });
  const [paymentImage, setPaymentImage] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const getDashboardData = useCallback(async () => {
    try {
      const dashboardData = await getUserDashboardData();
      setDashboard(dashboardData);
    } catch (error) {
      toast.error("Gagal memuat data dashboard");
    }
  }, []);

  const toggleFollow = useCallback(
    async (channel_id: string) => {
      setLoading(true);
      const req = await followChannel(channel_id);
      if (req) {
        toast.success("Berhasil!");
        await getDashboardData();
      } else {
        toast.error("Network Error!");
      }
      setLoading(false);
    },
    [getDashboardData]
  );

  const toggleFavorite = useCallback(
    async (event_id: string) => {
      setLoading(true);
      const req = await addFavorite(event_id);
      if (req) {
        toast.success("Berhasil!");
        await getDashboardData();
      } else {
        toast.error("Network Error!");
      }
      setLoading(false);
    },
    [getDashboardData]
  );

  const handleUpdatePayment = useCallback(
    async (user_event_id: string, image_url: string) => {
      const req = await updateUserEvent(user_event_id, image_url, false);
      if (req) {
        toast.success("Pembayaran berhasil!");
        window.location.reload();
        return;
      }
      toast.error("Terjadi kesalahan!");
    },
    []
  );

  const handleSubmitPayment = useCallback(
    async (user_event_id: string) => {
      if (!paymentImage) {
        toast.error("Upload bukti pembayaran!");
      } else {
        await handleUpdatePayment(user_event_id, paymentImage);
      }
    },
    [paymentImage, handleUpdatePayment]
  );

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back{" "}
            <span className="text-primary">{user?.firstName}</span> 👋
          </h2>
          <Link
            href={"/users/channels"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Kelola Channel
          </Link>
        </div>
        <Separator />
        <div className="mt-5">
          <div className="flex justify-between items-center">
            <div className="text-primary">Event yang pernah diikuti</div>
            <Link href={"/users/history-events"}>
              <Button variant={"secondary"} className="hover:text-primary">
                Lihat semua
              </Button>
            </Link>
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-1 gap-5">
              {dashboard?.user_events?.map((item) => (
                <Card
                  key={item.id}
                  className="hover:-translate-y-3 hover:border-primary transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-4 p-2">
                    <div className="relative w-[300px] h-[300px]">
                      <Image
                        src={item.events.image || ""}
                        alt="events"
                        fill
                        sizes="100%"
                        className="object-cover border border-muted rounded-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <CardTitle>
                        <Link
                          target="_blank"
                          href={"/events/" + item.events.id}
                          className="hover:text-primary"
                        >
                          {item.events.name}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        Diadakan oleh{" "}
                        <Link
                          href={"/channels/" + item.events.channels.id}
                          className="text-primary"
                        >
                          {item.events.channels.name}
                        </Link>
                      </CardDescription>
                      <div className="flex gap-4">
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <UserRound className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.categories.name}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <LayoutGrid className="w-4 h-4" />
                          <p className="text-xs">{item.events.tags.name}</p>
                        </div>
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.is_online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.event_date &&
                              formatDate(item.events.event_date)}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <Tag className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.is_paid
                              ? formatPrice(item.events.price)
                              : "Gratis"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5">
                        <div
                          className="text-sm text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html:
                              item.events.description.length > 600
                                ? item.events.description.slice(0, 600) + "...."
                                : item.events.description || "",
                          }}
                        />
                      </div>
                      <div className="mt-3 ms-auto flex gap-2">
                        {item.status === true && (
                          <Link
                            href={item.events.link_group}
                            target="_blank"
                            className={cn(
                              buttonVariants({
                                className: "text-white bg-green-500",
                              })
                            )}
                          >
                            Bergabung ke grub
                          </Link>
                        )}
                        {item.status === false &&
                          new Date(item.events.event_date) < new Date() && (
                            <Button disabled>Event Selesai</Button>
                          )}
                        {item.status === false &&
                          new Date(item.events.event_date) > new Date() && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button>Lunasi Pembayaran</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Lunasi Pembayaran</DialogTitle>
                                  <DialogDescription>
                                    Upload bukti pembayaranmu disini.
                                  </DialogDescription>
                                </DialogHeader>
                                <FileUpload
                                  apiEndpoint="image"
                                  onChange={(url) => setPaymentImage(url)}
                                  value={paymentImage}
                                />
                                <DialogFooter>
                                  <Button
                                    onClick={() => handleSubmitPayment(item.id)}
                                  >
                                    Submit
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        <Link href={"/events/" + item.events.id}>
                          <Button
                            variant={"secondary"}
                            className="hover:text-primary transition-all duration-300"
                          >
                            Lihat detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <Separator />
        <div className="mt-5">
          <div className="flex justify-between items-center">
            <div className="text-primary">Channel yang diikuti</div>
            <Link href={"/users/follows"}>
              <Button variant={"secondary"} className="hover:text-primary">
                Lihat semua
              </Button>
            </Link>
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <>
                {dashboard?.follows?.map((item) => (
                  <Card
                    key={item.id}
                    className="group hover:-translate-y-3 hover:border-primary transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex flex-col mb-5 gap-4">
                        <div className="relative w-full h-[300px]">
                          <Image
                            src={item.channels.image || ""}
                            alt="image"
                            fill
                            sizes="100%"
                            loading="lazy"
                            className="object-cover w-full h-full rounded"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <p className="text-xs text-muted-foreground">
                            Created by{" "}
                            <span className="text-primary">
                              {item.channels.users.name}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">|</p>
                          <p className="text-xs text-muted-foreground">
                            Tersedia{" "}
                            <span className="text-primary">
                              {item.channels._count.events} Event
                            </span>
                          </p>
                        </div>
                      </div>
                      <CardTitle>
                        <Link
                          href={"/channels/" + item.channels.id}
                          className="hover:text-primary"
                        >
                          {item.channels.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="max-w-lg">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.channels.description
                              ? item.channels.description.length > 150
                                ? `${item.channels.description.slice(
                                    0,
                                    150
                                  )}...`
                                : item.channels.description
                              : "",
                          }}
                        />
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex gap-2 ms-auto">
                        <Link href={"/channels/" + item.channels.id}>
                          <Button
                            variant={"secondary"}
                            className="hover:text-primary transition-all duration-300"
                          >
                            Lihat detail
                          </Button>
                        </Link>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"ghost"}
                                disabled={loading}
                                onClick={() => toggleFollow(item.channels.id)}
                                className="bg-red-500 text-white"
                              >
                                <Heart />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ikuti Channel</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </>
            </div>
          </div>
        </div>
        <Separator />
        <div className="mt-5">
          <div className="flex justify-between items-center">
            <div className="text-primary">Event Favorite</div>
            <Link href={"/users/favorites"}>
              <Button variant={"secondary"} className="hover:text-primary">
                Lihat semua
              </Button>
            </Link>
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {dashboard?.favorites?.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:-translate-y-3 hover:border-primary transition-all duration-300"
                >
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={item.events.image || ""}
                      alt="image"
                      width={0}
                      height={0}
                      fill
                      sizes="100%"
                      loading="lazy"
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex flex-col gap-4 mb-5">
                      <div className="flex gap-2">
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <UserRound className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.categories.name}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <LayoutGrid className="w-4 h-4" />
                          <p className="text-xs">{item.events.tags.name}</p>
                        </div>
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.is_online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.event_date &&
                              formatDate(item.events.event_date)}
                          </p>
                        </div>
                        <div className="flex gap-1 items-center text-muted-foreground">
                          <Tag className="w-4 h-4" />
                          <p className="text-xs">
                            {item.events.is_paid
                              ? formatPrice(item.events.price)
                              : "Gratis"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardTitle>
                      <Link
                        href={"/events/" + item.events.id}
                        className="hover:text-primary"
                      >
                        {item.events.name && item.events.name.length > 20
                          ? item.events.name.slice(0, 20) + "..."
                          : item.events.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="max-w-lg">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.events.description
                            ? item.events.description.length > 150
                              ? `${item.events.description.slice(0, 150)}...`
                              : item.events.description
                            : "",
                        }}
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex gap-2 ms-auto">
                      <Link href={"/events/" + item.events.id}>
                        <Button
                          variant={"secondary"}
                          className="hover:text-primary transition-all duration-300"
                        >
                          Lihat detail
                        </Button>
                      </Link>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={"ghost"}
                              disabled={loading}
                              onClick={() => toggleFavorite(item.events.id)}
                              className="transition-all duration-200 bg-primary text-white"
                            >
                              <Bookmark />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Simpan Event</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
