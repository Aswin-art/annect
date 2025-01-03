"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getAllData = async () => {
  const user = await currentUser();
  try {
    const req = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + `/users/${user?.id}/favorites`
    );

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
  }
};

export const addFavorite = async (event_id: string) => {
  let user = await currentUser();

  if (!user) return redirect("/sign-in");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id, user_id: user.id }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return null;
  }
};
