import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ChannelCreatedEmailProps {
  userFirstname: string | null;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ChannelCreatedEmail = ({
  userFirstname,
}: ChannelCreatedEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Channel Anda telah berhasil dibuat dan sedang menunggu verifikasi dari tim
      Annect.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="170"
          height="50"
          alt="Company Logo"
          style={{
            objectFit: "contain",
            margin: "0 auto",
          }}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Selamat! Channel Anda telah berhasil dibuat di Annect. Langkah
          selanjutnya adalah verifikasi oleh tim kami untuk memastikan bahwa
          channel Anda sesuai dengan pedoman komunitas Annect.
        </Text>
        <Text style={paragraph}>
          Ingin mengelola channel Anda? Klik tombol di bawah ini untuk melihat
          atau mengedit channel Anda.
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href="https://annect.vercel.app/users/channels"
          >
            Kelola Channel
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Annect team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Universitas Pembangunan Negeri Veteran Jawa Timur, Indonesia
        </Text>
      </Container>
    </Body>
  </Html>
);

ChannelCreatedEmail.PreviewProps = {
  userFirstname: "Alan",
} as ChannelCreatedEmailProps;

export default ChannelCreatedEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
