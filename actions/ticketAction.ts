"use server";

import { db } from "@/lib/db";

export const buyTicket = async (
  event_id: number,
  user_event_id: string,
  total_ticket: number
) => {
  try {
    const ticketsData = Array.from({ length: total_ticket }, () => ({
      event_id,
      status: false,
      user_event_id,
    }));

    const tickets = await db.tickets.createMany({
      data: ticketsData,
    });

    return tickets;
  } catch (err) {
    console.log(err);
  }
};
