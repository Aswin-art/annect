"use server";

import { db } from "@/lib/db";

export const getAllData = async () => {
  try {
    const req = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + `/tags`);

    if (req.ok) {
      const res = await req.json();
      return res;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAllDataLocal = async () => {
  try {
    const res = await db.tags.findMany();
    return res;
  } catch (err) {
    console.log(err);
    return [];
  }
};
