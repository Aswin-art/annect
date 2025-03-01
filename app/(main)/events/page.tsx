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
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, Suspense, useCallback, memo } from "react";
import { getAllData, searchEventByTitle } from "@/actions/eventAction";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import dynamic from "next/dynamic";

const CountUp = dynamic(() => import("react-countup"), {
  ssr: false,
  loading: () => <span className="text-primary">2000</span>,
});

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

const EventCard = memo(
  ({
    event,
    handleFavorite,
    favoriteLoading,
  }: {
    event: EventType;
    handleFavorite: (eventId: string) => void;
    favoriteLoading: boolean;
  }) => (
    <Card className="group hover:-translate-y-3 hover:border-primary transition-all duration-300">
      <div className="relative w-full h-[300px]">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          className="object-cover w-full h-full rounded-t-lg"
          priority={false}
        />
      </div>
      <CardHeader>
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 items-center text-muted-foreground">
              <UserRound className="w-4 h-4" />
              <p className="text-xs">{event.categories?.name}</p>
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
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 items-center text-muted-foreground">
              <Clock className="w-4 h-4" />
              <p className="text-xs">{formatDate(event.event_date)}</p>
            </div>
            <div className="flex gap-1 items-center text-muted-foreground">
              <Tag className="w-4 h-4" />
              <p className="text-xs">
                {event.is_paid ? formatPrice(event.price) : "Gratis"}
              </p>
            </div>
          </div>
        </div>
        <CardTitle>
          <Link
            href={`/events/${event.id}`}
            className="hover:text-primary line-clamp-2"
          >
            {event.name}
          </Link>
        </CardTitle>
        <CardDescription className="max-w-lg line-clamp-3">
          {event.description?.replace(/<[^>]*>/g, "")}
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
                  onClick={() => handleFavorite(event.id)}
                  disabled={favoriteLoading}
                  className={`hover:text-white hover:bg-primary transition-all duration-200 border border-primary ${
                    event.is_favorite ? "bg-primary text-white" : "text-primary"
                  }`}
                >
                  {favoriteLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Bookmark />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {event.is_favorite ? "Hapus Favorite" : "Simpan Event"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  )
);

EventCard.displayName = "EventCard";

const FilterSection = ({
  title,
  name,
  items,
  form,
}: {
  title: string;
  name: "tag_id" | "category_id" | "is_paid";
  items: Array<{ id: string; name: string }>;
  form: any;
}) => (
  <div className="flex flex-col gap-4">
    <h5 className="font-bold text-xl mb-2">{title}</h5>
    {items.map((item) => (
      <FormField
        key={item.id}
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                value={item.id}
                checked={field.value?.includes(item.id)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(field.value || []), item.id]
                    : (field.value || []).filter((id: any) => id !== item.id);
                  field.onChange(newValue);
                }}
              />
            </FormControl>
            <FormLabel className="!mt-0 cursor-pointer">{item.name}</FormLabel>
          </FormItem>
        )}
      />
    ))}
  </div>
);

export default function Page() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [tags, setTags] = useState<tags[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loadingFavorite, setLoadingFavorite] = useState<
    Record<string, boolean>
  >({});

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

  const getData = useCallback(
    async (
      name?: string | null,
      tags?: string | null,
      categories?: string | null,
      prices?: string | null
    ) => {
      try {
        const data = await getAllData(name, tags, categories, prices);
        setTags(data?.tags || []);
        setCategories(
          (data?.categories || []).map((category: any) => ({
            id: category.id,
            name: category.name || "Unknown",
          }))
        );
        setEvents(data?.events || []);
      } catch (error) {
        toast.error("Gagal memuat data");
      }
    },
    []
  );

  const handleResetFilter = useCallback(() => {
    form.reset();
    router.replace("/events", { scroll: false });
  }, [form, router]);

  const handleFavorite = useCallback(
    async (eventId: string) => {
      if (loadingFavorite[eventId]) return;
      setLoadingFavorite((prev) => ({ ...prev, [eventId]: true }));
      try {
        const result = await addFavorite(eventId);
        toast[result ? "success" : "error"](result ? "Berhasil" : "Gagal");
        await getData(nameParams, tagParams, categoryParams, priceParams);
      } catch (error) {
        toast.error("Server sedang sibuk");
      } finally {
        setLoadingFavorite((prev) => ({ ...prev, [eventId]: false }));
      }
    },
    [
      getData,
      nameParams,
      tagParams,
      categoryParams,
      priceParams,
      loadingFavorite,
    ]
  );

  const handleSearch = useCallback(
    (values: z.infer<typeof filterSchema>) => {
      const params = new URLSearchParams();

      if (values.name) params.set("name", values.name);
      if (values.tag_id?.length) params.set("tags", values.tag_id.join(","));
      if (values.category_id?.length)
        params.set("categories", values.category_id.join(","));
      if (values.is_paid?.length)
        params.set("prices", values.is_paid.join(","));

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname]
  );

  useEffect(() => {
    const initialValues = {
      name: nameParams,
      tag_id: tagParams?.split(",") || [],
      category_id: categoryParams?.split(",") || [],
      is_paid: priceParams?.split(",") || [],
    };

    form.reset(initialValues);
    getData(nameParams, tagParams, categoryParams, priceParams);
  }, [searchParams, form, getData]);

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
              priority
              quality={80}
              className="absolute bottom-0 left-0 ml-7"
            />
            <Image
              src={"/undraw_welcoming.svg"}
              alt="icon-search"
              width={180}
              height={180}
              priority
              quality={80}
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
                        <FormItem className="w-full">
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
                    <FilterSection
                      title="Tipe Event"
                      name="tag_id"
                      items={tags}
                      form={form}
                    />
                    <FilterSection
                      title="Kategori Event"
                      name="category_id"
                      items={categories}
                      form={form}
                    />
                    <FilterSection
                      title="Harga Event"
                      name="is_paid"
                      items={PRICE_TYPE.map((p) => ({
                        id: p,
                        name: p === "PAID" ? "Berbayar" : "Gratis",
                      }))}
                      form={form}
                    />
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
                  <FallbackLoading />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {events?.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        handleFavorite={handleFavorite}
                        favoriteLoading={loadingFavorite[event.id] || false}
                      />
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
