"use client";
import { getDashboardData } from "@/actions/dashboardAction";
import { AreaGraph } from "@/components/charts/area-graph";
import { TransactionChart } from "@/components/charts/transaction-chart";
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
import test from "node:test";
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

type DashboardData = {
  eventName: string;
  totalTickets: number;
  totalIncome: number;
  totalFollower: number;
  totalEvent: { date: string; count: number }[];
};

export default function Page({ params }: { params: { id: string } }) {
  const [dashboardData, setDashboard] = useState<DashboardData>();
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  );

  const getData = async () => {
    const data = await getDashboardData();
    setDashboard(data);
  };

  const getTicket = async () => {
    const response = await fetch(`/api/events/dashboard/${params.id}`);
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      setDashboard(data.data);
    }
  };

  const handleWithdraw = async () => {
  };

  useEffect(() => {
    getTicket();
  }, []);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {dashboardData?.eventName} Dashboard
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant={"success"} onClick={handleWithdraw}>
            With Draw
          </Button>
          <Link
            href={`/users/channels/events/update/${params.id}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Edit Event
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
                    {formatPrice(dashboardData?.totalIncome)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Follower Count
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData?.totalFollower}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-12">
                <TransactionChart
                  chartData={dashboardData?.totalEvent || []}
                  title="Bar chart transaksi user"
                  desc="list user transaction"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
