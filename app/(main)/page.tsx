"use client";

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import {BookCopy, Bookmark, GraduationCap, LayoutGrid, MapPin, Speech, Trophy, UserRound, Users} from "lucide-react";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import TextEffect from "@/components/TextEffect";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CountUp from "react-countup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {getAllEvent} from "@/actions/eventAction";

export default function Home({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState<EventType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      `/events?name=${encodeURIComponent(
        searchQuery
      )}&tags=&categories=&prices=`
    );
  };

  const tagsUp = [
    {
      id: 1,
      jenisAcara: "Exhibition",
      deskripsi:
          "A valuable opportunity to broaden your horizons and gain the latest knowledge directly from the experts.",
      icon: (
          <Speech
              width={60}
              height={60}
              className="group-hover:text-white transition-all duration-200 ease-in-out"
          />
      ),
      bg: "#E4B94A",
    },
    {
      id: 2,
      jenisAcara: "Bazaar",
      deskripsi:
          "An event to showcase your skills and gain recognition for achievements in your area of interest.",
      icon: (
          <Trophy
              width={60}
              height={60}
              className="group-hover:text-white transition-all duration-200 ease-in-out"
          />
      ),
      bg: "#45E29A",
    },
    {
      id: 3,
      jenisAcara: "Concert",
      deskripsi:
          "An interactive activity that engages participants to learn directly with guidance from instructors.",
      icon: (
          <Users
              width={60}
              height={60}
              className="group-hover:text-white transition-all duration-200 ease-in-out"
          />
      ),
      bg: "#EE521E",
    },
  ];

  const tagsDown = [
    {
      id: 1,
      jenisAcara: "Talkshow",
      deskripsi:
          "An intensive training program that accelerates practical learning and skills development, preparing participants for career success quickly.",
      icon: (
          <BookCopy
              width={60}
              height={60}
              className="group-hover:text-white transition-all duration-200 ease-in-out"
          />
      ),
      bg: "#F50058",
    },
    {
      id: 2,
      jenisAcara: "Workshop",
      deskripsi:
          "A valuable opportunity that provides education without financial burdens, allowing you to focus on learning and personal growth while opening broader career possibilities.",
      icon: (
          <GraduationCap
              width={60}
              height={60}
              className="group-hover:text-white transition-all duration-200 ease-in-out"
          />
      ),
      bg: "#D728F4",
    },
  ];


  const getEvent = async (
      nameParams?: string | null,
      tagParams?: string | null,
      categoryParams?: string | null,
      priceParams?: string | null
  ) => {
    const data = await getAllEvent(
        nameParams,
        tagParams,
        categoryParams,
        priceParams
    );
    setEventData(data);
  };

  useEffect(() => {
    getEvent();
  }, []);
  return (
    <ScrollArea className="h-full">
      <span className="fixed blur-[200px] w-[600px] h-[600px] rounded-full top-1/2 start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 bg-gradient-to-tl from-red-600/20 to-violet-600/20 dark:from-red-600/40 dark:to-violet-600/40"></span>

      {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" /> */}
      <Wrapper>
        <main className="pt-40">
          <div className="relative overflow-hidden">
            <div className="container">
              <div className="grid grid-cols-1 justify-center text-center mt-10">
                <div className="relative">
                  <div className="relative mb-5">
                    <h1 className="font-bold lg:leading-snug leading-snug text-4xl lg:text-6xl">
                      Cari Ticket dengan
                      <br/>
                      <span className="bg-gradient-to-l from-red-600 to-violet-600 text-transparent bg-clip-text">
                        {" "}
                        Mudah dan Terpercaya
                      </span>
                    </h1>

                    <div
                        className="overflow-hidden after:content-[''] after:absolute after:h-10 after:w-10 after:bg-violet-600/10 dark:after:bg-violet-600/30 after:-top-[50px] after:start-[30%] after:-z-1 after:rounded-lg after:animate-[spin_10s_linear_infinite]"></div>

                    <div
                        className="overflow-hidden after:content-[''] after:absolute after:h-10 after:w-10 after:bg-violet-600/20 dark:after:bg-violet-600/40 after:bottom-[0] after:end-[15%] after:-z-1 after:rounded-full after:animate-ping"></div>
                  </div>
                  <p className="text-slate-400 dark:text-white/70 text-lg max-w-xl mx-auto">
                    Temukan berbagai event akademik{" "}
                    <span className={`text-primary`}>terverifikasi</span> dengan
                    mudah dan aman, fokus pada{" "}
                    <span className={`text-primary`}>pengembangan diri</span>{" "}
                    tanpa khawatir akan{" "}
                    <span className={`text-primary`}>penipuan</span>.
                  </p>
                </div>
              </div>

              <div className="relative animate-[spin_30s_linear_infinite] -z-1">
                <span
                    className="after:absolute after:start-0 after:bottom-1/2 after:translate-y-1/2 after:h-2 after:w-8 after:rounded-md after:bg-violet-600/20 relative after:z-10"></span>
                <span
                    className="after:absolute after:start-0 after:bottom-1/2 after:translate-y-1/2 after:rotate-90 after:h-2 after:w-8 after:rounded-md after:bg-violet-600/20 relative after:z-10"></span>
              </div>
            </div>
          </div>

          <div className="mt-32">
            <div className="flex justify-center items-center w-full">
              <Card className="max-w-4xl w-full">
                <div className="grid grid-cols-12 items-center p-6 gap-4 md:gap-0 w-full">
                  <div className="md:col-span-4 col-span-12">
                    <h3 className="text-4xl font-bold text-primary">
                      Tersedia
                    </h3>
                  </div>
                  <div className="md:col-span-8 col-span-12">
                    <div className="grid grid-cols-12">
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={7} duration={7}/>
                          </h3>
                          <p className="text-muted-foreground">Tipe Event</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={2000} duration={3}/>
                          </h3>
                          <p className="text-muted-foreground">Event</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={1000} duration={3}/>
                          </h3>
                          <p className="text-muted-foreground">Channel</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={5000} duration={3}/>
                          </h3>
                          <p className="text-muted-foreground">Pengguna</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-60">
            <div className="flex flex-col gap-4 justify-center items-center text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Berbagai Macam Event
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Platform Annect menawarkan kesempatan untuk menjelajahi dan
                menemukan acara yang sesuai dengan minat dan kebutuhan Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 gap-4">
              {tagsUp.map((card) => (
                  <Card
                      key={card.id}
                      className="min-h-[200px] group hover:border-primary transition-all duration-200 ease-in-out"
                  >
                    <div className="grid grid-cols-12 w-full h-full p-2 gap-4">
                      <div
                          className="col-span-5 rounded-lg flex justify-center items-center group-hover:!bg-primary transition-all duration-200 ease-in-out"
                          style={{backgroundColor: card.bg}}
                      >
                        {card.icon}
                      </div>
                      <div className="col-span-7">
                        <div className="flex flex-col gap-4">
                          <h2 className="font-bold text-xl lg:text-2xl">
                            {card.jenisAcara}
                          </h2>
                          <p className="text-muted-foreground">
                            {card.deskripsi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tagsDown.map((card) => (
                  <Card
                      key={card.id}
                      className="min-h-[200px] group hover:border-primary transition-all duration-200 ease-in-out"
                  >
                    <div className="grid grid-cols-12 w-full h-full p-2 gap-4">
                      <div
                          className="col-span-5 rounded-lg flex justify-center items-center group-hover:!bg-primary transition-all duration-200 ease-in-out"
                          style={{backgroundColor: card.bg}}
                      >
                        {card.icon}
                      </div>
                      <div className="col-span-7">
                        <div className="flex flex-col gap-4">
                          <h2 className="font-bold text-xl lg:text-2xl">
                            {card.jenisAcara}
                          </h2>
                          <p className="text-muted-foreground">
                            {card.deskripsi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
              ))}
            </div>
          </div>
          <div className="mt-40">
            <div className="flex flex-col gap-4 justify-center items-center text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Ikuti Event & Upgrade Dirimu
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Jangan lewatkan kesempatan berkembang! Ikuti event akademik
                untuk memperkaya wawasan dan keterampilan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-14">
              {eventData.length > 0 ? (
                  eventData.map((event) => (
                      <Card
                          key={event.id}
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
                                <UserRound className="w-4 h-4"/>
                                <span className="text-xs">
                              {event.categories?.name}
                            </span>
                              </div>
                              <div className="flex gap-1 items-center text-muted-foreground">
                                <LayoutGrid className="w-4 h-4"/>
                                <span className="text-xs">{event.tags?.name}</span>
                              </div>
                              <div className="flex gap-1 items-center text-muted-foreground">
                                <MapPin className="w-4 h-4"/>
                                <span className="text-xs">
                              {event.is_online ? "Online" : "Offline"}
                            </span>
                              </div>
                            </div>
                          </div>
                          <CardTitle>
                            <Link
                                href={`/events/${event.id}`}
                                className="hover:text-primary"
                            >
                              {event.name.length > 20
                                  ? event.name.slice(0, 20) + "..."
                                  : event.name}
                            </Link>
                          </CardTitle>
                          <CardDescription className="max-w-lg">
                        <span
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
                            <Link href={`/events/${event.id}`}>
                              <Button
                                  variant="secondary"
                                  className="hover:text-primary transition-all duration-300"
                              >
                                Lihat detail
                              </Button>
                            </Link>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      onClick={() => console.log("oke")}
                                      className={`hover:text-white hover:bg-primary transition-all duration-200 ${
                                          event.is_favorite
                                              ? "bg-primary text-white"
                                              : "text-primary"
                                      }`}
                                  >
                                    <Bookmark/>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {event.is_favorite ? (
                                      <span>Hapus Favorite</span>
                                  ) : (
                                      <span>Simpan Event</span>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardFooter>
                      </Card>
                  ))
              ) : (
                  <div className="col-span-1 lg:col-span-4">
                    <div className="flex justify-center items-center">
                      <p className="text-muted-foreground">
                        Tidak ada event yang ditemukan.
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </main>
      </Wrapper>
    </ScrollArea>
  );
}
