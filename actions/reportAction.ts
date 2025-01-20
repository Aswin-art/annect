"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const addReport = async (eventId: string, description: string) => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  try {
    const report = await db.reports.create({
      data: {
        user_id: user.id,
        event_id: eventId,
        description,
      },
    });

    return report;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAllReportData = async () => {
  try {
    const reports = await db.reports.findMany({
      include: {
        events: true,
        users: true,
      },
    });
    return reports;
  } catch (err) {
    console.log(err);
    return [];
  }
};
