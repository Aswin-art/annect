import { formatPrice } from "@/lib/format";
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

interface JoinEventEmailProps {
  userFirstname: string | null;
  eventPrice: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const JoinEventEmail = ({
  userFirstname,
  eventPrice,
}: JoinEventEmailProps) => (
  <Html>
    <Head />
    <Preview>Anda telah berhasil bergabung ke sebuah event.</Preview>
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
          Terima kasih telah tertarik untuk bergabung ke event Annect. Untuk
          melanjutkan proses pendaftaran, Anda perlu menyelesaikan pembayaran
          sebesar <strong>{formatPrice(eventPrice)}</strong>.
        </Text>
        <Text style={paragraph}>
          Setelah pembayaran sebesar <strong>{formatPrice(eventPrice)}</strong>{" "}
          dikonfirmasi, Anda akan segera mendapatkan email untuk bergabung ke
          grub event.
        </Text>
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

JoinEventEmail.PreviewProps = {
  userFirstname: "Alan",
} as JoinEventEmailProps;

export default JoinEventEmail;

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
