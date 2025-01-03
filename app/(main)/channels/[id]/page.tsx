"use client";

import React, { useEffect, useState } from "react";
import Wrapper from "@/components/Wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getChannelById } from "@/actions/channelAction";
import {
  BookmarkCheck,
  Clock,
  Bookmark,
  Tag,
  LayoutGrid,
  MapPin,
  UserRound,
} from "lucide-react";
import FallbackLoading from "@/components/Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, formatPrice } from "@/lib/format";
import toast from "react-hot-toast";
import { followChannel } from "@/actions/followAction";

type UserType = {
  id: string;
  name: string;
  image: string;
};

type EventType = {
  id: string;
  name: string;
  description: string;
  location: string;
  event_date: string;
  image: string;
  price: number;
  is_paid: boolean;
  is_online: boolean;
  categories?: {
    id: string;
    name: string;
  };
  tags?: {
    id: string;
    name: string;
  };
};

type ChannelType = {
  id: string;
  name: string;
  description: string;
  image: string;
  users?: UserType;
  is_following: boolean;
  _count?: {
    follows: number;
    events: number;
  };
  events?: EventType[];
};

export default function Page({ params }: { params: { id: string } }) {
  const [channels, setChannels] = useState<ChannelType>();

  const [isFollowing, setIsFollowing] = useState(false);

  const getChannelDetail = async () => {
    const data = await getChannelById(params.id);
    setChannels(data);
    console.log(data);
  };

  const handleFollowChannel = async () => {
    try {
      await followChannel(params.id);
      setIsFollowing(true);
      toast.success("Berhasil");
      await getChannelDetail();
    } catch (error) {
      toast.error("Gagal");
    }
  };

  useEffect(() => {
    getChannelDetail();
  }, []);
  return (
    <Wrapper>
      <div className="mt-40">
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
            <div className="mt-10 mb-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={
                        channels?.users?.image ??
                        "https://github.com/shadcn.png"
                      }
                      // src={"https://github.com/shadcn.png"}
                      fill
                      sizes="100%"
                      alt="avatar"
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-xl">{channels?.users?.name}</p>
                  </div>
                </div>
                <Button
                  className={`${
                    channels.is_following &&
                    "bg-red-500 text-white hover:bg-red-700"
                  }`}
                  onClick={handleFollowChannel}
                >
                  {channels.is_following
                    ? "Berhenti Mengikuti"
                    : "Ikuti Channel"}
                </Button>
              </div>
            </div>
            <Separator />
            <Tabs defaultValue="events" className="space-y-4">
              <TabsList>
                <TabsTrigger value="events">Daftar Event</TabsTrigger>
                <TabsTrigger value="description">Deskripsi</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {channels?.events?.map((event, index: number) => (
                    <Card
                      key={index}
                      className="group hover:-translate-y-3 hover:border-primary transition-all duration-300"
                    >
                      <div className="relative w-full h-[300px]">
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
                      </div>
                      <CardHeader>
                        <div className="flex flex-col gap-4 mb-5">
                          <div className="flex gap-2">
                            <div className="flex gap-1 items-center text-muted-foreground">
                              <UserRound className="w-4 h-4" />
                              <p className="text-xs">
                                {event.categories?.name}
                              </p>
                            </div>
                            <div className="flex gap-1 items-center text-muted-foreground">
                              <LayoutGrid className="w-4 h-4" />
                              <p className="text-xs">{event.tags?.name}</p>
                            </div>
                            <div className="flex gap-1 items-center text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <p className="text-xs">
                                {event.is_online ? "Online" : "Offline"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex gap-1 items-center text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <p className="text-xs">
                                {event.event_date &&
                                  formatDate(event.event_date)}
                              </p>
                            </div>
                            <div className="flex gap-1 items-center text-muted-foreground">
                              <Tag className="w-4 h-4" />
                              <p className="text-xs">
                                {event.is_paid
                                  ? formatPrice(event.price)
                                  : "Gratis"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <CardTitle>
                          <Link
                            href={"/events/" + event.id}
                            className="hover:text-primary"
                          >
                            {event.name.length > 20
                              ? event.name.slice(0, 20) + "..."
                              : event.name}
                          </Link>
                        </CardTitle>
                        <CardDescription className="max-w-lg">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: event.description
                                ? event.description.length > 150
                                  ? `${event.description.slice(0, 150)}...`
                                  : event.description
                                : "",
                            }}
                          />
                        </CardDescription>
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={"ghost"}
                                  onClick={async () => handleFollowChannel()}
                                  className="hover:text-white text-primary hover:bg-primary transition-all duration-200"
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
              </TabsContent>
              <TabsContent value="description" className="space-y-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: channels?.description || "",
                  }}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <FallbackLoading />
        )}
      </div>
    </Wrapper>
  );
}
