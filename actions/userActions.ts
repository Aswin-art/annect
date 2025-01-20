"use server";

import { db } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mail";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { users_role } from "@prisma/client";
import { redirect } from "next/navigation";

type UserData = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: users_role;
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

export const checkUser = async (
  id: string,
  name: string,
  email: string,
  image: string
) => {
  const user = await currentUser();
  const client = await clerkClient();

  const getUserFromDB = await db.users.findUnique({
    where: {
      id,
    },
  });

  if (!getUserFromDB) {
    let role: users_role = "USER";

    if (
      email &&
      email.length > 0 &&
      email === "22081010099@student.upnjatim.ac.id"
    ) {
      role = "ADMIN";
    }

    await client.users.updateUserMetadata(id, {
      privateMetadata: {
        role,
      },
    });

    const data: UserData = {
      id,
      name,
      email,
      image,
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

export const findUser = async (id: string) => {
  try {
    const user = await db.users.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const user = db.users.delete({
      where: {
        id,
      },
    });

    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};
