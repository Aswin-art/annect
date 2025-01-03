"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main className="h-full">{children}</main>
      <Footer />
    </>
  );
};

export default layout;
