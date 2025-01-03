"use server";
import { currentUser } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

export async function generateToken(): Promise<string> {
  const user = await currentUser();
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const secret = process.env.NEXT_PUBLIC_STREAM_SECRET_KEY;

  if (!apiKey) throw new Error("API key not found");
  if (!secret) throw new Error("Secret not found");
  if (!user) throw new Error("User not found");

  const serverClient = new StreamChat(apiKey, secret);
  return serverClient.createToken(user.id);
}
