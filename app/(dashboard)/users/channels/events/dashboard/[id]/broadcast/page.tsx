"use client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import TextareaAutosize from "react-textarea-autosize";
import dynamic from "next/dynamic";
const EditableEditor = dynamic(() => import("@/components/EditableEditor"), {
  ssr: false,
});

const breadcrumbItems = [
  { title: "Dashboard", link: "/users" },
  { title: "Channels", link: "/users/channels" },
  { title: "Broadcast", link: "/users/channels/create" },
];

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Buat Channel Baru`}
            description="Lengkapi form untuk melakukan broadcasting kepada seluruh member event!"
          />
        </div>
        <Separator />

        <div className="grid lg:grid-cols-12 gap-4">
          <div className="col-span-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          {...field}
                          placeholder="Judul Email...."
                        />
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
                      <FormLabel>Deskripsi Email</FormLabel>
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.back()}
                    type="button"
                    disabled={isLoading}
                    variant={"secondary"}
                    className="hover:text-primary"
                  >
                    Kembali
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="col-span-8">
            <Separator className="rotate-90 origin-left" />
            <div className="ms-2">
              <div className="mt-5">
                <TextareaAutosize
                  placeholder="Judul Email...."
                  value={form.watch("title")}
                  className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                  disabled
                />

                <div className="mt-5">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: form.watch("description"),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
