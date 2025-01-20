"use client";
import { followChannel, getAllData } from "@/actions/followAction";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import FallbackLoading from "@/components/Loading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Follows", link: "/users/follows" },
];

type UserType = {
  id: string;
  name: string;
};

type ChannelType = {
  id: string;
  name: string;
  image: string;
  description: string;
  created_at: Date;
  users: UserType;
  _count: {
    events: number;
  };
};

type FollowType = {
  id: string;
  channels: ChannelType;
};

export default function Page() {
  const [followings, setFollowings] = useState<FollowType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
  const getData = async () => {
    const req = await getAllData();
    setFollowings(req);
    setLoading(false);
  };

  const toggleFollow = async (channel_id: string) => {
    setLoadingFollow(true);
    const req = await followChannel(channel_id);
    if (req) {
      toast.success("Berhasil!");
      await getData();
    } else {
      toast.error("Network Error!");
    }
    setLoadingFollow(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <Heading
          title={`Channel yang diikuti (${followings?.length ?? 0})`}
          description="Daftar channel akademik yang diikuti."
        />
        <Separator />

        {loading ? (
          <FallbackLoading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {followings &&
              followings?.map((item, index: number) => (
                <Card
                  key={index}
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
                              ? `${item.channels.description.slice(0, 150)}...`
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
                              onClick={() => toggleFollow(item.channels.id)}
                              disabled={loadingFollow}
                              className="bg-red-500 text-white"
                            >
                              <Heart />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Berhenti Mengikuti</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
