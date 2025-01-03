"use client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { addDays, format, setHours, setMinutes, setSeconds } from "date-fns";
import EditableEditor from "@/components/EditableEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { categories, tags } from "@prisma/client";
import { getEventById } from "@/actions/eventAction";
import Link from "next/link";
import FallbackLoading from "@/components/Loading";
import { DatetimePicker } from "@/components/ui/extension/datetime-picker";

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Channels", link: "/users/channels" },
  { title: "Update Events", link: "/users/channels/events/update" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be exists.",
  }),
  description: z.string().min(2, {
    message: "description must be exists.",
  }),
  image: z.string().min(2, {
    message: "image must be exists.",
  }),
  tag_id: z.string().min(2, {
    message: "tag must be exists.",
  }),
  category_id: z.string().min(2, {
    message: "category must be exists.",
  }),
  location: z.string().min(2, {
    message: "location must be exists.",
  }),
  link_group: z.string().min(2, {
    message: "link must be exists.",
  }),
  price: z.coerce.number().min(0),
  event_date: z.date(),
  is_paid: z.coerce.boolean(),
});

export default function Page({ params }: { params: { id: string } }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [tags, setTags] = useState<tags[]>([]);
  const [categories, setCategories] = useState<categories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const isLoading = form.formState.isSubmitting;

  const updateHandler = async (values: z.infer<typeof formSchema>) => {
    const tomorrow = setSeconds(
      setMinutes(setHours(addDays(new Date(), 1), 0), 0),
      0
    );

    if (values.event_date < tomorrow) {
      toast.error("Tanggal event harus minimal besok!");
      return false;
    }

    try {
      const req = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/events/" + params.id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      if (req.ok) {
        toast.success("Success!");

        router.push("/users/channels");
      }
    } catch (err) {
      toast.error("Failed!");
      console.log(err);
    }
  };

  const getData = async () => {
    const req = await getEventById(params.id);
    const date = new Date(req?.event_date);
    if (req) {
      form.setValue("name", req?.name);
      form.setValue("is_paid", req?.is_paid);
      form.setValue("image", req?.image);
      form.setValue("description", req?.description);
      form.setValue("price", req?.price);
      form.setValue("event_date", date);
      form.setValue("location", req?.location);
      form.setValue("link_group", req?.link_group);
      form.setValue("tag_id", req?.tag_id);
      form.setValue("category_id", req?.category_id);

      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateHandler(values);
  };

  useEffect(() => {
    const getTags = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`);
        const res = await req.json();
        if (res.length > 0) {
          setTags(res);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const getCategories = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`
        );
        const res = await req.json();
        if (res.length > 0) {
          setCategories(res);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getTags();
    getCategories();
    getData();
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Update Event`}
            description="Lengkapi form untuk mengupdate event."
          />
        </div>
        <Separator />

        {loading ? (
          <FallbackLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster Event</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="image"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Event</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Event</FormLabel>
                    <FormControl>
                      <EditableEditor
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_paid"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative flex items-center gap-2 mt-5">
                        <Checkbox
                          disabled={isLoading}
                          onCheckedChange={field.onChange}
                          checked={field.value}
                        />
                        <span className="text-muted-foreground text-xs">
                          Apakah event berbayar?
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Event</FormLabel>
                      <FormControl>
                        <Input
                          disabled={
                            isLoading || form.getValues("is_paid") == false
                          }
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Event</FormLabel>
                      <DatetimePicker
                        {...field}
                        format={[
                          ["months", "days", "years"],
                          ["hours", "minutes", "am/pm"],
                        ]}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi Event</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Grub Event</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tag_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag / Tipe Event</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tipe" />
                          </SelectTrigger>
                          <SelectContent>
                            {tags?.map((tag, index) => (
                              <SelectItem key={index} value={tag.id}>
                                {tag.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Event</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((item, index) => (
                              <SelectItem key={index} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="mt-5" />
              <div className="flex gap-2">
                <Link
                  href={"/users/channels"}
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      className: "text-primary",
                    })
                  )}
                >
                  Kembali
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </ScrollArea>
  );
}
