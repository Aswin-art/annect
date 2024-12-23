"use server";

import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { users_role } from "@prisma/client";

const insertUser = async ({
  id,
  wallet_address,
  role,
}: {
  id: string;
  wallet_address: string;
  role: users_role;
}) => {
  try {
    await db.users.create({
      data: {
        id,
        wallet_address,
        role,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const checkUser = async () => {
  let user: any;
  try {
    user = await currentUser();
  } catch (err) {
    console.log(err);
  }
  const wallet = user?.primaryWeb3Wallet?.web3Wallet;

  if (!user || !wallet) return null;

  const getUserFromDB = await db.users.findUnique({
    where: {
      wallet_address: wallet,
    },
  });

  if (!getUserFromDB) {
    let role: users_role = "USER";

    if (user.id === "user_2qQVAqjws7Wzaaxxgif1KXia8x8") {
      role = "ADMIN";
    }

    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role,
      },
    });

    const data = {
      id: user.id,
      wallet_address: wallet,
      role,
    };

    await insertUser(data);

    // if (data.role == "USER") {
    //   await sendWelcomeEmail(data.email, data.name);
    // }
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
