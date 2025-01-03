"use client";

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { BookCopy, GraduationCap, Speech, Trophy, Users } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TextEffect from "@/components/TextEffect";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CountUp from "react-countup";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      `/events?name=${encodeURIComponent(
        searchQuery
      )}&tags=&categories=&prices=`
    );
  };

  const tagsUp = [
    {
      id: 1,
      jenisAcara: "Seminar",
      deskripsi:
        "kesempatan berharga untuk memperluas wawasan dan mendapatkan pengetahuan terkini langsung dari ahlinya.",
      icon: (
        <Speech
          width={60}
          height={60}
          className="group-hover:text-white transition-all duration-200 ease-in-out"
        />
      ),
      bg: "#E4B94A",
    },
    {
      id: 2,
      jenisAcara: "Lomba",
      deskripsi:
        "ajang untuk menunjukkan keterampilan Anda dan meraih pengakuan atas prestasi pada bidang yang Anda minati",
      icon: (
        <Trophy
          width={60}
          height={60}
          className="group-hover:text-white transition-all duration-200 ease-in-out"
        />
      ),
      bg: "#45E29A",
    },
    {
      id: 3,
      jenisAcara: "Workshop",
      deskripsi:
        "kegiatan interaktif yang melibatkan peserta untuk belajar secara langsung dengan bimbingan instruktur",
      icon: (
        <Users
          width={60}
          height={60}
          className="group-hover:text-white transition-all duration-200 ease-in-out"
        />
      ),
      bg: "#EE521E",
    },
  ];

  const tagsDown = [
    {
      id: 1,
      jenisAcara: "Bootcamp",
      deskripsi:
        "program pelatihan intensif yang mempercepat pembelajaran praktis dan keterampilan, mempersiapkan peserta untuk sukses dalam karier dengan cepat",
      icon: (
        <BookCopy
          width={60}
          height={60}
          className="group-hover:text-white transition-all duration-200 ease-in-out"
        />
      ),
      bg: "#F50058",
    },
    {
      id: 2,
      jenisAcara: "Beasiswa",
      deskripsi:
        "peluang berharga yang memungkinkan Anda mendapatkan pendidikan tanpa beban biaya, sehingga bisa fokus pada studi dan pengembangan diri sambil membuka peluang karier yang lebih luas",
      icon: (
        <GraduationCap
          width={60}
          height={60}
          className="group-hover:text-white transition-all duration-200 ease-in-out"
        />
      ),
      bg: "#D728F4",
    },
  ];
  return (
    <ScrollArea className="h-full">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
      <Wrapper>
        <main className="pt-40">
          <div className="flex flex-col mx-auto justify-center items-center text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider flex flex-col justify-center w-full md:flex-row gap-0 md:gap-4">
              <div className="flex gap-4 text-start md:text-center">
                Cari <TextEffect />
              </div>{" "}
              <div className="text-start md:text-center">Dengan</div>
            </h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-start md:text-center w-full">
              Mudah Dan{" "}
              <span
                className="underline"
                style={{ textDecorationColor: "#1e40af" }}
              >
                Terpercaya
              </span>
            </h2>
            <p className="dark:text-muted-foreground w-full md:max-w-lg mt-5 text-start md:text-center">
              Temukan berbagai event akademik{" "}
              <span className="text-primary">terverifikasi</span> dengan mudah
              dan aman, fokus pada{" "}
              <span className="text-primary">pengembangan diri</span> tanpa
              khawatir akan <span className="text-primary">penipuan</span>.
            </p>
            <div className="max-w-2xl w-full bg-muted dark:bg-transparent border-2 dark:border border-secondary dark:border-primary rounded-lg mt-10 shadow-xl">
              <form
                onSubmit={(e) => handleSearch(e)}
                className="grid grid-cols-12 gap-4"
              >
                <div className="lg:col-span-9 col-span-12 p-2 flex items-center">
                  <Input
                    type="text"
                    placeholder="cari nama event..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-lg border-none bg-transparent focus-visible::outline-none focus-visible::border-none focus-visible:ring-transparent focus-visible:ring-offset-0"
                  />
                </div>
                <div className="lg:col-span-3 col-span-12 p-2">
                  <Button
                    type="submit"
                    className="w-full h-full p-4 text-lg text-white"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-32">
            <div className="flex justify-center items-center w-full">
              <Card className="max-w-4xl w-full">
                <div className="grid grid-cols-12 items-center p-6 gap-4 md:gap-0 w-full">
                  <div className="md:col-span-4 col-span-12">
                    <h3 className="text-4xl font-bold text-primary">
                      Tersedia
                    </h3>
                  </div>
                  <div className="md:col-span-8 col-span-12">
                    <div className="grid grid-cols-12">
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={7} duration={7} />
                          </h3>
                          <p className="text-muted-foreground">Tipe Event</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={2000} duration={3} />
                          </h3>
                          <p className="text-muted-foreground">Event</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={1000} duration={3} />
                          </h3>
                          <p className="text-muted-foreground">Channel</p>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex flex-col items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            <CountUp end={5000} duration={3} />
                          </h3>
                          <p className="text-muted-foreground">Pengguna</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-60">
            <div className="flex flex-col gap-4 justify-center items-center text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Berbagai Macam Event
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Platform Annect menawarkan kesempatan untuk menjelajahi dan
                menemukan acara yang sesuai dengan minat dan kebutuhan Anda.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-10 gap-4">
              {tagsUp.map((card) => (
                <Card
                  key={card.id}
                  className="min-h-[200px] group hover:border-primary transition-all duration-200 ease-in-out"
                >
                  <div className="grid grid-cols-12 w-full h-full p-2 gap-4">
                    <div
                      className="col-span-5 rounded-lg flex justify-center items-center group-hover:!bg-primary transition-all duration-200 ease-in-out"
                      style={{ backgroundColor: card.bg }}
                    >
                      {card.icon}
                    </div>
                    <div className="col-span-7">
                      <div className="flex flex-col gap-4">
                        <h2 className="font-bold text-xl lg:text-2xl">
                          {card.jenisAcara}
                        </h2>
                        <p className="text-muted-foreground">
                          {card.deskripsi}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tagsDown.map((card) => (
                <Card
                  key={card.id}
                  className="min-h-[200px] group hover:border-primary transition-all duration-200 ease-in-out"
                >
                  <div className="grid grid-cols-12 w-full h-full p-2 gap-4">
                    <div
                      className="col-span-5 rounded-lg flex justify-center items-center group-hover:!bg-primary transition-all duration-200 ease-in-out"
                      style={{ backgroundColor: card.bg }}
                    >
                      {card.icon}
                    </div>
                    <div className="col-span-7">
                      <div className="flex flex-col gap-4">
                        <h2 className="font-bold text-xl lg:text-2xl">
                          {card.jenisAcara}
                        </h2>
                        <p className="text-muted-foreground">
                          {card.deskripsi}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-40">
            <div className="flex flex-col gap-4 justify-center items-center text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Ikuti Event & Upgrade Dirimu
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Jangan lewatkan kesempatan untuk berkembang secara akademik dan
                profesional. Tingkatkan potensi dan pengetahuan Anda dengan
                mengikuti berbagai event akademik yang dirancang untuk
                memperkaya wawasan dan keterampilan.
              </p>
            </div>
          </div>
        </main>
      </Wrapper>
    </ScrollArea>
  );
}
