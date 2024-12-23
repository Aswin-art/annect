"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const createUserEvent = async (event_id: number, user_id: string) => {
  try {
    const userEvent = await db.user_events.findFirst({
      where: {
        user_id,
        event_id,
      },
    });

    if (!userEvent) {
      const createUserEvent = await db.user_events.create({
        data: {
          user_id,
          event_id,
          status: true,
        },
      });

      if (!createUserEvent) return false;

      return createUserEvent;
    }

    return userEvent;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const buyTicket = async (total_ticket: number, event_id: number) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  try {
    const userEvents = await createUserEvent(event_id, user.id);

    if (!userEvents) return false;

    const events = await db.events.findUnique({
      where: {
        id: event_id,
      },
    });

    if (!events) return false;

    await db.events.update({
      where: {
        id: event_id,
      },
      data: {
        stock: events.stock - total_ticket,
      },
    });

    const ticketsData = Array.from({ length: total_ticket }, () => ({
      status: false,
      user_eventsId: userEvents.id,
    }));

    const tickets = await db.tickets.createMany({
      data: ticketsData,
    });

    return tickets;
  } catch (err) {
    console.log(err);
  }
};
