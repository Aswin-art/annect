"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "@/components/Wrapper";
import { useParams, useRouter } from "next/navigation";
import FallbackLoading from "@/components/Loading";
import "stream-chat-react/dist/css/v2/index.css";
import ChatComponent from "@/components/ChatComponent";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getEventById } from "@/actions/eventAction";
import { events } from "@prisma/client";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const eventId: string = id;
  const { user, isLoaded, isSignedIn } = useUser();
  const [event, setEvent] = useState<events>();
  const router = useRouter();

  const getDataEventDetail = async () => {
    const req = await getEventById(eventId);
    setEvent(req);
  };

  useEffect(() => {
    if (!isSignedIn) return router.push("/sign-in");

    getDataEventDetail();
  }, [router, isSignedIn]);

  return (
    <Wrapper>
      <div className="mt-40">
        <Link
          href={"/events/" + eventId}
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "hover:text-primary",
            })
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Kembali
        </Link>
        {isLoaded && user && event ? (
          <ChatComponent
            userId={user.id}
            imageUrl={user.imageUrl}
            fullName={user.fullName}
            eventId={eventId}
            eventName={event.name}
            eventImage={event.image}
          />
        ) : (
          <FallbackLoading />
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
