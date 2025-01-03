"use server";

import { db } from "@/lib/db";
import { sendJoinEventEmail, sendPaymentDoneEmail } from "@/lib/mail";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getAllData = async () => {
  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/user_events"
    );

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
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
