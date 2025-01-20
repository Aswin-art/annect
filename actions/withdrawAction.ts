"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getAllWithdrawData = async () => {
  try {
    const data = db.withdraw_requests.findMany({
      include: {
        events: {
          select: {
            name: true,
            image: true,
            event_date: true,
          },
        },
        users: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const addWithdrawRequest = async (event_id: string, amount: number) => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  try {
    const data = await db.withdraw_requests.create({
      data: {
        user_id: user.id,
        event_id,
        amount,
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const acceptWithdrawRequest = async (id: string) => {
  try {
    const data = await db.withdraw_requests.update({
      where: {
        id,
      },
      data: {
        status: true,
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
