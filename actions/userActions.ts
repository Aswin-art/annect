"use server";

import { db } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mail";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { users_role } from "@prisma/client";
import { redirect } from "next/navigation";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  image: string;
  role: users_role | undefined;
};

const insertUser = async ({ id, name, email, image, role }: UserData) => {
  try {
    await db.users.create({
      data: {
        id,
        email,
        name,
        role,
        image,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) return null;

  const getUserFromDB = await db.users.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!getUserFromDB) {
    let role: users_role = "USER";

    if (
      user.emailAddresses &&
      user.emailAddresses.length > 0 &&
      user.emailAddresses[0].emailAddress ===
        "22081010099@student.upnjatim.ac.id"
    ) {
      role = "ADMIN";
    }

    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role,
      },
    });

    const data: UserData = {
      id: user.id,
      name: user.fullName,
      email: user.emailAddresses[0]?.emailAddress,
      image: user.imageUrl,
      role,
    };

    await insertUser(data);

    if (data.role == "USER") {
      await sendWelcomeEmail(data.email, data.name);
    }
  }

  return user;
};

export const getAllData = async () => {
  try {
    const req = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/users");

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentUser = async () => {
  const user = await currentUser();

  if (user?.id) {
    return user;
  }

  return null;
};

export const getUserDashboardData = async () => {
  const user = await currentUser();
  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/users/" + user?.id
    );

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
  }
};
