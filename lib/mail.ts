import { Resend } from "resend";
import EventCreatedEmail from "@/emails/create-event";
import WelcomeEmail from "@/emails/welcome";
import ChannelCreatedEmail from "@/emails/create-channel";
import ChannelValidatedEmail from "@/emails/channel-validated";
import PaymentDoneEmail from "@/emails/payment-done";
import { JoinEventEmail } from "@/emails/join-event";
import { getAllDataFollowers } from "@/actions/followAction";
import BroadcastEmail from "@/emails/broadcast";
import { currentUser } from "@clerk/nextjs/server";
import PaymentProcessEmail from "@/emails/payment-process";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email verification",
      html: `<p>Click <a href=${confirmLink}>here</a> to verified your email.</p>`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email reset password",
      html: `<p>Click <a href=${resetLink}>here</a> to reset your password.</p>`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "2FA Token",
      html: `<p>Your token is: ${token}</p>`,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendWelcomeEmail = async (email: string, name: string | null) => {
  try {
    await resend.emails.send({
      from: "Annect <marketing@awsd-qwerty.com>",
      to: email,
      subject: "Selamat Datang di Annect! 🚀",
      react: WelcomeEmail({ userFirstname: name }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendEventCreatedEmail = async (
  email: string,
  name: string | null
) => {
  try {
    await resend.emails.send({
      from: "Annect <marketing@awsd-qwerty.com>",
      to: email,
      subject: "Event Anda Berhasil Diunggah di Annect! 🎉",
      react: EventCreatedEmail({ userFirstname: name, eventPrice: 100 }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendChannelCreatedEmail = async (
  email: string,
  name: string | null
) => {
  try {
    await resend.emails.send({
      from: "Annect <marketing@awsd-qwerty.com>",
      to: email,
      subject: "Event Anda Berhasil Diunggah di Annect! 🎉",
      react: ChannelCreatedEmail({ userFirstname: name }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendChannelValidatedEmail = async (
  email: string,
  name: string | null
) => {
  try {
    await resend.emails.send({
      from: "Annect <marketing@awsd-qwerty.com>",
      to: email,
      subject: "Event Anda Berhasil Diunggah di Annect! 🎉",
      react: ChannelValidatedEmail({ userFirstname: name }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendPaymentDoneEmail = async (
  email: string,
  name: string | null,
  link_group: string
) => {
  try {
    await resend.emails.send({
      from: "Annect <marketing@awsd-qwerty.com>",
      to: email,
      subject: "Pembayaran Anda telah diterima. Selamat bergabung!",
      react: PaymentDoneEmail({ userFirstname: name, linkGroup: link_group }),
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendPaymentProcessEmail = async () => {
  const user = await currentUser();

  if (user) {
    try {
      await resend.emails.send({
        from: "Annect <marketing@awsd-qwerty.com>",
        to: user.emailAddresses[0].emailAddress,
        subject:
          "Pembayaran Anda telah kami terima. Dan akan di proses oleh admin!",
        react: PaymentProcessEmail({
          userFirstname: user.firstName,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("user not found");
    return null;
  }
};

export const sendJoinEventEmail = async (
  email: string,
  name: string | null,
  price: number
) => {
  try {
    await resend.emails.send({
      from: "Annect <marketing@awsd-qwerty.com>",
      to: email,
      subject: "Anda telah berhasil bergabung ke sebuah event.",
      react: JoinEventEmail({ userFirstname: name, eventPrice: price }),
    });
  } catch (err) {
    console.log(err);
  }
};

type UserType = {
  id: string;
  name: string | null;
  email: string;
};

type FollowerType = {
  id: string;
  users: UserType;
};

export const sendBroadcastEmail = async (channel_id: string) => {
  try {
    const followers: FollowerType[] = await getAllDataFollowers(channel_id);

    await Promise.all(
      followers.map(async (item) => {
        await resend.emails.send({
          from: "Annect <marketing@awsd-qwerty.com>",
          to: item.users.email,
          subject: "Event baru telah dibuat!",
          react: BroadcastEmail({
            userFirstname: item.users.name,
            channel_id: channel_id,
          }),
        });
      })
    );
  } catch (err) {
    console.log(err);
    return null;
  }
};
