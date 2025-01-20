"use server";

import { db } from "@/lib/db";
import { sendJoinEventEmail, sendPaymentDoneEmail } from "@/lib/mail";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getAllData = async () => {
  try {
    const data = await db.withdraw_requests.findMany({
      include: {
        users: {
          select: {
            email: true,
          },
        },
        events: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const joinEvent = async (
  event_id: string,
  price: number,
  link_group: string
) => {
  const user = await currentUser();

  if (user) {
    try {
      const userEvent = await db.user_events.findFirst({
        where: {
          event_id,
          user_id: user.id,
        },
      });

      if (userEvent) return true;

      const req = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/user_events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            event_id,
            status: price > 0 ? false : true,
          }),
        }
      );

      if (req.ok) {
        const res = await req.json();

        if (price > 0) {
          await sendJoinEventEmail(
            user.emailAddresses[0].emailAddress,
            user.firstName,
            price
          );
        } else {
          await sendPaymentDoneEmail(
            user.emailAddresses[0].emailAddress,
            user.firstName,
            link_group
          );
        }
        return res;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  } else {
    redirect("/sign-in");
    return null;
  }
};

export const eventPaymentDone = async (event_id: string) => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  try {
    const userEvent = await db.user_events.findFirst({
      where: {
        event_id,
        user_id: user.id,
      },
      include: {
        events: true,
      },
    });

    if (!userEvent) return null;

    await db.user_events.update({
      where: {
        id: userEvent.id,
      },
      data: {
        status: true,
      },
    });

    await sendPaymentDoneEmail(
      user.emailAddresses[0].emailAddress,
      user.firstName,
      userEvent.events?.link_group as string
    );

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAllDataMember = async (event_id: string) => {
  try {
    const members = await db.user_events.findMany({
      where: {
        event_id,
      },
      include: {
        users: true,
      },
    });

    return members;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getDetailData = async (id: string) => {
  try {
    const data = await db.user_events.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
