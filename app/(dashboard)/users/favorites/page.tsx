"use client";
import { addFavorite, getAllData } from "@/actions/favoriteAction";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { categories, channels, favorites, tags } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bookmark,
  Clock,
  LayoutGrid,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react";
import { formatDate, formatPrice } from "@/lib/format";
import toast from "react-hot-toast";
import FallbackLoading from "@/components/Loading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Favorites", link: "/users/favorites" },
];

type EventType = {
  id: string;
  name: string;
  image: string;
  description: string;
  event_date: Date;
  price: number;
  is_online: boolean;
  is_paid: boolean;
  tags: tags;
  categories: categories;
  channels: channels;
};

type FavoriteType = {
  id: string;
  events: EventType;
};

export default function Page() {
  const [favorites, setFavorites] = useState<FavoriteType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const getData = async () => {
    const req = await getAllData();
    setFavorites(req);
    setLoading(false);
  };

  const toggleFavorite = async (event_id: string) => {
    setLoadingFavorite(true);
    const req = await addFavorite(event_id);

    if (req) {
      toast.success("Berhasil!");
      await getData();
    } else {
      toast.error("Network Error!");
    }

    setLoadingFavorite(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <Heading
          title={`Event yang disukai (${favorites?.length ?? 0})`}
          description="Daftar berbagai event akademik yang disukai"
        />
        <Separator />

        {loading ? (
          <FallbackLoading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {favorites && favorites?.length > 0
              ? favorites?.map((item, index: number) => (
                  <Card
                    key={index}
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
                          {item.events.name && item.events.name?.length > 20
                            ? item.events.name?.slice(0, 20) + "..."
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
                                disabled={loadingFavorite}
                                onClick={() => toggleFavorite(item.events.id)}
                                className="transition-all duration-200 bg-primary text-white"
                              >
                                <Bookmark />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Hapus Favorite</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              : "Tidak ada event favorite!"}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
