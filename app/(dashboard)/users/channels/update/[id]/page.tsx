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
import { useEffect, useState } from "react";
import EditableEditor from "@/components/EditableEditor";
import { getChannelById } from "@/actions/channelAction";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FallbackLoading from "@/components/Loading";

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Channels", link: "/users/channels" },
  { title: "Update", link: "/users/channels/update" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  image: z.string().min(2, {
    message: "Image must be exists.",
  }),
  nik: z.string().min(2, {
    message: "NIK must be exists.",
  }),
  no_rek: z.string().min(2, {
    message: "No. Rek must be exists.",
  }),
  phone: z.string().min(2, {
    message: "Phone must be exists.",
  }),
});

export default function Page({ params }: { params: { id: string } }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const isLoading = form.formState.isSubmitting;

  const getData = async () => {
    const req = await getChannelById(params.id);
    form.setValue("name", req?.name);
    form.setValue("description", req?.description);
    form.setValue("image", req?.image);
    form.setValue("nik", req?.nik);
    form.setValue("no_rek", req?.no_rek);
    form.setValue("phone", req?.phone);
    setLoading(false);
  };

  const updateHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      const req = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/channels/" + params.id,
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateHandler(values);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Update Channel`}
            description="Lengkapi form untuk mengedit channel"
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
                    <FormLabel>Background Channel</FormLabel>
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
                    <FormLabel>Nama Channel</FormLabel>
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
                    <FormLabel>Deskripsi Channel</FormLabel>
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK (Nomor Induk Kewarganegaran)</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="no_rek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Rekening</FormLabel>
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Link
                  href={"/users/channels"}
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      className: "hover:text-primary",
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
