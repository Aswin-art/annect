import React from "react";
import { TailSpin } from "react-loading-icons";

type Props = {};

const loading = (props: Props) => {
  return (
    <main className="h-screen w-screen flex justify-center items-center bg-background/50">
      <TailSpin stroke="#1e40af" />
    </main>
  );
};

export default loading;
