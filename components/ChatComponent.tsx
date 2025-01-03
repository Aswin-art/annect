"use client";
import React from "react";
import Wrapper from "@/components/Wrapper";
import FallbackLoading from "@/components/Loading";
import { User } from "@clerk/nextjs/server";
import { generateToken } from "@/lib/stream";
import { useCallback } from "react";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  DefaultStreamChatGenerics,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { ChannelSort } from "stream-chat";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type DiscussionType = {
  userId: string;
  fullName: string | null;
  imageUrl: string | null;
  eventId: string;
  eventName: string | null | undefined;
  eventImage: string | null | undefined;
};

const ChatComponent = ({
  userId,
  fullName,
  imageUrl,
  eventId,
  eventImage,
  eventName,
}: DiscussionType) => {
  console.log(fullName, imageUrl, eventName, eventImage);
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY ?? "f8xhcwkqn9sg";

  const router = useRouter();

  const tokenProvider = useCallback(async () => {
    return await generateToken();
  }, []);

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: tokenProvider,
    userData: {
      id: userId,
      name: fullName ?? "Guest",
      image: imageUrl ?? `https://getstream.io/random_png/?name=${fullName}`,
    },
  });

  const setupChannel = async () => {
    try {
      if (!client) {
        toast.error("Ruang Diskusi tidak tersedia!");
        router.back();
        return;
      }

      const existingChannels = await client.queryChannels({
        id: { $eq: eventId },
      });
      let channel;

      if (existingChannels && existingChannels?.length > 0) {
        channel = existingChannels[0];
      } else {
        channel = client.channel("messaging", eventId, {
          name: eventName ? "Channel " + eventName : "Channel",
          image: eventImage ?? "",
        });
        await channel.create();
      }

      if (channel) {
        const isUserMember = channel.state.members[userId];

        if (!isUserMember) {
          await channel.addMembers([userId]);
        }
      }

      return channel;
    } catch (err) {
      console.log(err);
      toast.error("Ruang Diskusi tidak tersedia!");
      router.back();
      return;
    }
  };

  if (client) {
    setupChannel();
  }

  const sort: ChannelSort<DefaultStreamChatGenerics> = { last_message_at: -1 };
  const filters = {
    type: "messaging",
    members: { $in: [userId] },
  };
  const options = {
    limit: 10,
  };

  return (
    <div className="mt-10">
      {client ? (
        <Chat client={client}>
          {/* <ChannelList filters={filters} sort={sort} options={options} /> */}
          <Channel key={eventId} channel={client.channel("messaging", eventId)}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      ) : (
        <FallbackLoading />
      )}
    </div>
  );
};

export default ChatComponent;
