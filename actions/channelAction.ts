"use server";

import { db } from "@/lib/db";
import { sendChannelCreatedEmail, sendChannelValidatedEmail } from "@/lib/mail";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getAllData = async (name?: string | null) => {
  try {
    let user = await currentUser();
    let req;
    if (name) {
      req = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/channels?user_id=${user?.id}&name=${name}`
      );
    } else {
      req = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/channels?user_id=${user?.id}`
      );
    }

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getChannelByUserId = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  try {
    const channel = await db.channels.findFirst({
      where: {
        users: {
          id: user.id,
        },
      },
      include: {
        events: {
          include: {
            categories: true,
            tags: true,
            user_events: true,
          },
        },
        users: true,
        follows: {
          include: {
            users: true,
          },
        },
        _count: true,
      },
    });

    return channel;
  } catch (err) {
    console.log(err);
    return null;
  }
};

type createValue = {
  name: string;
  description: string;
  image: string;
  ktp_photo: string;
  user_id?: string;
};

export const createChannels = async (values: createValue) => {
  const user = await currentUser();
  const data = values;
  data.user_id = user?.id;

  if (user) {
    try {
      const req = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/channels",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (req.ok) {
        await sendChannelCreatedEmail(
          user?.emailAddresses[0].emailAddress,
          user?.firstName
        );
        return true;
      }

      return false;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  return null;
};

export const getChannelById = async (channel_id: string) => {
  let user = await currentUser();

  if (!user) return redirect("/sign-in");

  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/channels/${channel_id}/${user.id}`,
      {
        method: "GET",
      }
    );
    if (!req.ok) {
      console.error(`Failed to fetch event. Status: ${req.status}`);
      return null;
    }

    const data = await req.json();
    data.email = data.users.email;
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export const searchChannelByName = async (name: string) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/channels/?name=${encodeURIComponent(name)}`
    );
    if (response.ok) {
      const results = await response.json();
      return results;
    } else {
      throw new Error("Failed to search events");
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

export const channelVerification = async (channel_id: string) => {
  try {
    const channel = await db.channels.findUnique({
      where: {
        id: channel_id,
      },
      include: {
        users: true,
      },
    });

    if (channel?.users) {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/channels/${channel_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "VERIFIED" }),
        }
      );
      if (!req.ok) {
        console.error(`Failed to fetch event. Status: ${req.status}`);
        return null;
      }

      await sendChannelValidatedEmail(
        channel.users?.email || "",
        channel.users?.name
      );
      return true;
    }

    return false;
  } catch (err) {
    console.log(err);
    return null;
  }
};
