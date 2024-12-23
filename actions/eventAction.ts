"use server";
import { db } from "@/lib/db";
import {
  sendEventCreatedEmail,
  sendPaymentDoneEmail,
  sendPaymentProcessEmail,
} from "@/lib/mail";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const getAllData = async (
  nameParams?: string | null,
  tagParams?: string | null,
  priceParams?: string | null
) => {
  const user = await currentUser();

  try {
    const getTags = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/tags");
    const getEvents = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL +
        `/events?users=${user?.id}&name=${nameParams}&tags=${tagParams}&prices=${priceParams}`
    );

    const tagRes = await getTags.json();
    const eventRes = await getEvents.json();

    const data = {
      tags: tagRes,
      events: eventRes,
    };

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllEvent = async (
    nameParams?: string | null,
    tagParams?: string | null,
    categoryParams?: string | null,
    priceParams?: string | null
) => {
  try {
    const user = await currentUser();
    const getEvents = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `/events?users=${user?.id}&name=${nameParams}&tags=${tagParams}&categories=${categoryParams}&prices=${priceParams}`
    );
    const eventRes = await getEvents.json();
    return eventRes.slice(0, 4);
  } catch (err) {
    console.log(err);
  }
}

export const getAllDataAdmin = async () => {
  const user = await currentUser();

  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + `/events/admin`
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

export const getEventById = async (event_id: string) => {
  const user = await currentUser();
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${event_id}?user_id=${user?.id}`,
      {
        method: "GET",
      }
    );

    // Cek status respon
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

export const eventVerification = async (event_id: string) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${event_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "ONGOING" }),
      }
    );
    if (!req.ok) {
      console.error(`Failed to fetch event. Status: ${req.status}`);
      return null;
    }

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const eventPayment = async (event_id: string, image: string) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${event_id}/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id, image }),
      }
    );
    if (!req.ok) {
      console.error(`Failed to fetch event. Status: ${req.status}`);
      return null;
    }

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const searchEventByTitle = async (title: string) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/events/?name=${encodeURIComponent(title)}`
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

const getSpesificChannelByUserId = async (user_id: string) => {
  try {
    const channel = await db.channels.findFirst({
      where: {
        user_id,
      },
    });

    return channel;
  } catch (err) {
    console.log(err);
    return null;
  }
};

type createValues = {
  name: string;
  description: string;
  image: string;
  tag_id: string;
  location: string;
  price: number;
  event_date: Date;
  channel_id?: string;
  capacity: number;
  stock?: number;
};

export const createEvents = async (values: createValues) => {
  const user = await currentUser();

  if (user && user.privateMetadata.role === "USER") {
    const channel = await getSpesificChannelByUserId(user.id);
    if (channel) {
      values.channel_id = channel.id;
      values.stock = values.capacity;
      try {
        const req = await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/events",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (req.ok) {
          await sendEventCreatedEmail(
            channel.email,
            user?.primaryWeb3Wallet?.web3Wallet as string
          );
          return true;
        }

        return false;
      } catch (err) {
        console.log(err);
        return null;
      }
    }
  }

  return null;
};

export type EventType = {
  id: string;
  name: string;
  description: string;
  location: string;
  event_date: string;
  image: string;
  categories?: {
    id: string;
    name: string;
  };
  tags?: {
    id: string;
    name: string;
  };
};

export const filterEvents = async (
  category: string | null,
  tag: string | null,
  is_paid: boolean | null,
  search: string | null
) => {
  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/`);

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getHistoryUserEvent = async () => {
  const user = await currentUser();

  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL +
        `/users/${user?.id}/event-histories`
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

export const updateUserEvent = async (
  user_event_id: string,
  image_url: string | null,
  status: boolean | null,
  link_group: string = ""
) => {
  const user = await currentUser();

  if (user) {
    try {
      const req = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + `/user_events/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user_event_id,
            tf_image: image_url,
            status,
          }),
        }
      );

      if (req.ok) {
        const res = await req.json();

        if (status) {
          await sendPaymentDoneEmail(
            user.emailAddresses[0].emailAddress,
            user.firstName,
            link_group
          );
        } else {
          await sendPaymentProcessEmail();
        }

        return true;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  } else {
    return null;
  }
};

export const getDashboardData = async () => {
  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/dashboard"
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

export const cancelEvent = async (id: number ) => {
  try{
    await prisma.events.update({
      where: {
        id: id
      },
      data: {
        status: "CANCELED"
      }
    });
  }catch(err){
    console.log(err);
  }
}