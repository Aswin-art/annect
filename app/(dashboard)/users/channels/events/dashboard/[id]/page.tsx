"use client";
import { getDashboardData } from "@/actions/dashboardAction";
import { AreaGraph } from "@/components/charts/area-graph";
import { BarGraph } from "@/components/charts/bar-graph";
import { PieGraph } from "@/components/charts/pie-graph";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { events, users } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Tag = {
  name: string;
  totalData: number;
};

type TransactionType = {
  created_at: Date;
  events: events;
  users: users;
  status: boolean;
};

type Dashboard = {
  userCount: number;
  eventCount: number;
  channelCount: number;
  totalprice: number | null;
  transaction: TransactionType[];
  tagsWithEventCount: Tag[];
};

export default function Page({ params }: { params: { id: string } }) {
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [eventName, setEvent] = useState<string>("");
  const [lastTransaction, setLastTransaction] = useState<TransactionType[]>();
  const [income, setIncome] = useState<number>(0);
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  );

  const getData = async () => {
    const data = await getDashboardData();
    setDashboard(data);
    console.log(data.transaction);
  };

  const getTicket = async () => {
    const response = await fetch(`/api/events/dashboard/${params.id}`);
    if (response.ok) {
      const data = await response.json();
      const chartData = data.groupedUserEvents.map(
        (item: { date: string; count: number }) => ({
          date: item.date,
          count: item.count,
        })
      );
      setChartData(chartData);
      setIncome(data.totalIncome);
      setEvent(data.eventName);
      setLastTransaction(data.lastUserTrx);
    }
  };

  useEffect(() => {
    getTicket();
    getData();
  }, []);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {eventName} Dashboard
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant={"success"}>With Draw</Button>
          <Link
            href={`/users/channels/events/update/${params.id}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Edit Channel
          </Link>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Income
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(income)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-12">
                <BarGraph
                  chartData={chartData}
                  title="Bar chart transaksi user"
                  desc="list user transaction"
                />
              </div>
              {/* <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Last Transaction</CardTitle>
                  <CardDescription>
                    Ada sebanyak 10 transaksi di bulan ini.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboard?.transaction && (
                    <RecentSales data={dashboard.transaction} />
                  )}
                </CardContent>
              </Card> */}
              {/* <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div> */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
