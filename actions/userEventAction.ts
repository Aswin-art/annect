"use server";

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

export const joinEvent = async (event_id: number) => {
  const user = await currentUser();

  if (user) {
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
          status: true,
        }),
      }
    );

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } else {
    redirect("/sign-in");
  }
};
