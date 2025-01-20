"use client";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import {
  Clock,
  Bookmark,
  Tag,
  LayoutGrid,
  MapPin,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { getAllData, searchEventByTitle } from "@/actions/eventAction";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CountUp from "react-countup";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categories, tags } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import FallbackLoading from "@/components/Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, formatPrice } from "@/lib/format";
import { addFavorite } from "@/actions/favoriteAction";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

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
  is_favorite: boolean;
  categories?: {
    id: string;
    name: string;
  };
  tags?: {
    id: string;
    name: string;
  };
};

const PRICE_TYPE = ["PAID", "UNPAID"];

const filterSchema = z.object({
  tag_id: z.string().array().nullable(),
  category_id: z.string().array().nullable(),
  name: z.string().nullable(),
  is_paid: z.string().array().nullable(),
});

export default function Page() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [tags, setTags] = useState<tags[]>([]);
  const [categories, setCategories] = useState<categories[]>([]);

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      name: "",
      category_id: [],
      tag_id: [],
      is_paid: [],
    },
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nameParams = searchParams.get("name");
  const tagParams = searchParams.get("tags");
  const categoryParams = searchParams.get("categories");
  const priceParams = searchParams.get("prices");

  const getData = async (
    nameParams?: string | null,
    tagParams?: string | null,
    categoryParams?: string | null,
    priceParams?: string | null
  ) => {
    const data = await getAllData(
      nameParams,
      tagParams,
      categoryParams,
      priceParams
    );

    setTags(data?.tags);
    setCategories(data?.categories);
    setEvents(data?.events);
  };

  const handleResetFilter = async () => {
    form.reset();
    router.replace("/events", {
      scroll: false,
    });
  };

  const handleFavorite = async (eventId: string) => {
    const result = await addFavorite(eventId);

    if (result) {
      toast.success("Berhasil");
      getData();
    } else {
      toast.error("Gagal");
    }
  };

  useEffect(() => {
    if (nameParams || tagParams || categoryParams || priceParams) {
      form.setValue("name", nameParams);
      getData(nameParams, tagParams, categoryParams, priceParams);
    } else {
      getData();
    }
  }, [searchParams]);

  const handleSearch = async (value: z.infer<typeof filterSchema>) => {
    const tags = value.tag_id?.join(",");
    const prices = value.is_paid?.join(",");
    const categories = value.category_id?.join(",");

    router.push(
      `${pathname}?name=${value.name}&tags=${tags}&categories=${categories}&prices=${prices}`,
      {
        scroll: false,
      }
    );
  };

  return (
    <Suspense fallback={<FallbackLoading />}>
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
              <CountUp end={2000} duration={2} className="text-primary" /> Event
              Akademik Tersedia Sekarang
            </h1>
            <p className="text-muted-foreground max-w-lg text-center">
              Jelajahi berbagai event akademik terverifikasi yang dirancang
              untuk mendukung pengembangan diri Anda dengan mudah dan aman.
            </p>
            <div className="max-w-2xl z-10 w-full bg-muted lg:dark:bg-transparent border-2 dark:border border-secondary dark:border-primary rounded-lg mt-10 shadow-xl">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSearch)}
                  className="grid grid-cols-12 gap-4"
                >
                  <div className="lg:col-span-9 col-span-12 p-2 flex items-center">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="cari nama event..."
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              className="w-full text-lg border-none bg-transparent focus-visible:outline-none focus-visible:border-none focus-visible:ring-transparent focus-visible:ring-offset-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="lg:col-span-3 col-span-12 p-2">
                    <Button
                      type="submit"
                      className="w-full h-full p-4 text-lg text-white"
                    >
                      Search
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-semibold text-xl">Filter</h5>
                  <Button
                    variant={"secondary"}
                    onClick={() => handleResetFilter()}
                    className="hover:text-primary"
                  >
                    Reset
                  </Button>
                </div>
                <Separator className="my-3" />
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSearch)}
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-4">
                      <h5 className="font-bold text-xl mb-2">Tipe Event</h5>
                      {tags?.map((tag) => (
                        <FormField
                          key={tag.id}
                          control={form.control}
                          name="tag_id"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  value={tag.id}
                                  checked={field.value?.includes(tag.id)}
                                  onCheckedChange={(isChecked: boolean) => {
                                    const newValue = isChecked
                                      ? [...(field.value || []), tag.id]
                                      : (field.value || []).filter(
                                          (id) => id !== tag.id
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                {tag.name}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-4">
                      <h5 className="font-bold text-xl mb-2">Kategori Event</h5>
                      {categories?.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="category_id"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  value={category.id}
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(isChecked: boolean) => {
                                    const newValue = isChecked
                                      ? [...(field.value || []), category.id]
                                      : (field.value || []).filter(
                                          (id) => id !== category.id
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                {category.name}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-4">
                      <h5 className="font-bold text-xl mb-2">Harga Event</h5>
                      {PRICE_TYPE.map((price) => (
                        <FormField
                          key={price}
                          control={form.control}
                          name="is_paid"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  value={price}
                                  checked={field.value?.includes(price)}
                                  onCheckedChange={(isChecked: boolean) => {
                                    const newValue = isChecked
                                      ? [...(field.value || []), price]
                                      : (field.value || []).filter(
                                          (id) => id !== price
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                {price === "PAID" ? "Berbayar" : "Gratis"}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-4">
                      <Button
                        type="submit"
                        className="w-full h-full p-4 text-lg text-white"
                      >
                        Search
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              <div className="col-span-12 lg:col-span-9">
                {events?.length <= 0 ? (
                  <p className="text-secondary-foreground flex justify-center items-center">
                    Tidak ada event yang tersedia....
                  </p>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {events?.map((event) => (
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
                                    onClick={() => handleFavorite(event.id)}
                                    className={`hover:text-white hover:bg-primary transition-all duration-200 border border-primary ${
                                      event.is_favorite
                                        ? "bg-primary text-white"
                                        : "text-primary"
                                    }`}
                                  >
                                    <Bookmark />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {event.is_favorite ? (
                                    <p>Hapus Favorite</p>
                                  ) : (
                                    <p>Simpan Event</p>
                                  )}
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
            </div>
          </div>
        </main>
      </Wrapper>
    </Suspense>
  );
}
