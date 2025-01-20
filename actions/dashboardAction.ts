"use server";

import { db } from "@/lib/db";

export const getDashboardData = async () => {
  try {
    const totalChannel = await db.channels.count();
    const totalUser = await db.users.count({
      where: {
        role: "USER",
      },
    });
    const totalEvent = await db.events.count();
    const events = await db.events.findMany({
      where: {
        NOT: {
          is_paid: false,
        },
      },
      select: {
        post_duration: true,
      },
    });

    const totalRevenue = events.reduce(
      (sum, event) => sum + event.post_duration * 500,
      0
    );

    const latest_transactions = await db.user_events.findMany({
      where: {
        status: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
      include: {
        users: true,
        events: true,
      },
    });

    const tagsData = await db.tags.findMany({
      select: {
        name: true,
        events: {
          select: {
            id: true,
          },
        },
      },
    });

    const tagCounts = tagsData.map((tag) => ({
      name: tag.name,
      totalData: tag.events.length,
    }));

    const data = {
      totalChannel,
      totalUser,
      totalEvent,
      totalRevenue,
      latest_transactions,
      tagCounts,
    };

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
