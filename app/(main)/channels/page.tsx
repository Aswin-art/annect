"use client";

import Wrapper from "@/components/Wrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllData, searchChannelByName } from "@/actions/channelAction";
import CountUp from "react-countup";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import FallbackLoading from "@/components/Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { followChannel } from "@/actions/followAction";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UserType = {
  id: string;
  name: string;
};

type ChannelType = {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: Date;
  is_following: boolean;
  _count: {
    events: number;
  };
  users: UserType;
  channels: ChannelType[] | string[];
};

export default function Page() {
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [query, setQuery] = useState<string>("");
  const [followedChannels, setFollowedChannels] = useState<string[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nameParams = searchParams.get("name");
  const router = useRouter();

  const getData = async (name: string | null) => {
    const channelAction = await getAllData(name);
    setChannels(channelAction);
    const followed = channelAction.filter((channel: ChannelType) =>
      followedChannels.includes(channel.id)
    );
    setChannels((prevChannels) => [...prevChannels, ...followed]);
  };

  const handleSearch = async () => {
    router.push(`${pathname}?name=${query}`, {
      scroll: false,
    });
  };

  const handleFollowChannels = async (channelId: string) => {
    try {
      const result = await followChannel(channelId);

      if (result?.message == "success") {
        toast.success("Berhasil");
        await getData(nameParams);
      } else {
        toast.error("Gagal");
      }
    } catch (error) {
      toast.error("Gagal memperbarui status channel");
    }
  };

  useEffect(() => {
    getData(nameParams);
  }, [searchParams]);

  return (
    <Wrapper>
      <main className="pt-40">
        <div className="flex flex-col items-center gap-5 px-10 md:px-36 py-16 lg:px-44 lg:py-16 bg-blue-50 dark:bg-blue-800/10 rounded-lg relative">
          <Image
            src={"/undraw_globe.svg"}
            alt="icon-chart"
            width={210}
            height={210}
            loading="lazy"
            className="absolute bottom-0 left-0 ml-7"
          />
          <Image
            src={"/undraw_welcoming.svg"}
            alt="icon-search"
            width={180}
            height={180}
            loading="lazy"
            className="absolute right-0 bottom-0 mr-5"
          />
          <h1 className="text-4xl text-center font-semibold">
            <CountUp end={1000} duration={2} className="text-primary" /> Channel
            Akademik Yang Aktif
          </h1>
          <p className="text-muted-foreground max-w-lg text-center">
            Ikuti berbagai channel terpercaya yang menyediakan beragam event
            untuk mendukung perjalanan belajar dan pengembangan diri Anda.
          </p>
          <div className="max-w-2xl z-10 w-full bg-muted lg:dark:bg-transparent border-2 dark:border border-secondary dark:border-primary grid grid-cols-12 gap-4 rounded-lg mt-10 shadow-xl">
            <div className="lg:col-span-9 col-span-12 p-2 flex items-center">
              <Input
                type="text"
                placeholder="cari nama channel..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-lg border-none bg-transparent focus-visible::outline-none focus-visible::border-none focus-visible:ring-transparent focus-visible:ring-offset-0"
              />
            </div>
            <div className="lg:col-span-3 col-span-12 p-2">
              <Button
                onClick={() => handleSearch()}
                className="w-full h-full p-4 text-lg text-white"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-10">
          {channels?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {channels?.map((item) => (
                <Card
                  key={item.id}
                  className="group hover:-translate-y-3 hover:border-primary transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex flex-col mb-5 gap-4">
                      <div className="relative w-full h-[300px]">
                        <Image
                          src={item.image || ""}
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
                            {item.users.name}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">|</p>
                        <p className="text-xs text-muted-foreground">
                          Tersedia{" "}
                          <span className="text-primary">
                            {item._count.events} Event
                          </span>
                        </p>
                      </div>
                    </div>
                    <CardTitle>
                      <Link
                        href={"/channels/" + item.id}
                        className="hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="max-w-lg">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.description
                            ? item.description.length > 150
                              ? `${item.description.slice(0, 150)}...`
                              : item.description
                            : "",
                        }}
                      />
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex gap-2 ms-auto">
                      <Link href={"/channels/" + item.id}>
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
                              onClick={async () =>
                                await handleFollowChannels(item.id)
                              }
                              className={
                                item.is_following === true
                                  ? "bg-red-500 text-white"
                                  : "text-red-500 hover:text-white hover:bg-red-500"
                              }
                            >
                              <Heart />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {item.is_following ? (
                              <p>Berhenti Mengikuti</p>
                            ) : (
                              <p>Ikuti Channel</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <FallbackLoading />
          )}
        </div>
      </main>
    </Wrapper>
  );
}
