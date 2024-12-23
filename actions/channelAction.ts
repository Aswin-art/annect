"use server";

import { db } from "@/lib/db";
import { sendChannelCreatedEmail, sendChannelValidatedEmail } from "@/lib/mail";
import { currentUser } from "@clerk/nextjs/server";

export const getAllData = async () => {
  try {
    let user = await currentUser();

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/channels?user_id=${user?.id}`,
      { cache: "no-store" }
    );

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAllChannelForAdmin = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/channels`,
      { cache: "no-store" }
    );

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getDetailChannelForAdmin = async (channel_id: string) => {
  try {
    const channel = await db.channels.findUnique({
      where: {
        id: channel_id,
      },
    });

    return channel;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export const getChannelByUserId = async () => {
  const user = await currentUser();

  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/channels/users/" + user?.id
    );

    if (req.ok) {
      const res = await req.json();

      return res;
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

type createValue = {
  name: string;
  description: string;
  image: string;
  email: string;
  nik: string;
  ktp_photo: string;
  phone: string;
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

      // const res = await req.text();
      // console.log(res);

      const res = await req.json();

      if (res) {
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
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/channels/${channel_id}/${user?.id}`,
      {
        method: "GET",
      }
    );
    if (!req.ok) {
      console.error(`Failed to fetch event. Status: ${req.status}`);
      return null;
    }

    const data = await req.json();
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
        channel.email || "",
        channel.users.wallet_address
      );

      return channel;
    }

    return false;
  } catch (err) {
    console.log(err);
    return null;
  }
};
