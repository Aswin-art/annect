"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEventAnalytic } from "@/actions/eventAction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MemberTable } from "@/components/tables/user/member-tables/table";
import toast from "react-hot-toast";
import { addWithdrawRequest } from "@/actions/withdrawAction";

export default function Page({ params }: { params: { id: string } }) {
  const [dashboardData, setDashboard] = useState<any>();

  const getData = async () => {
    const data = await getEventAnalytic(params.id);
    setDashboard(data);
  };

  const handleWithdraw = async (event_id: string) => {
    if (dashboardData.event.status !== "DONE") {
      toast.error("Tunggu sampai event selesai!");
    }

    const req = await addWithdrawRequest(event_id, dashboardData?.totalIncome);

    if (req) {
      toast.success("Permintaan withdraw berhasil dibuat!");
    } else {
      toast.error("Netwrok Error!");
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        {!dashboardData && (
          <Alert className="bg-blue-100">
            <AlertTitle>Event Anda Tidak Aktif!</AlertTitle>
            <AlertDescription>
              Mohon maaf event anda masih belum disetujui oleh admin, harap
              selesaikan pembayaran untuk publish event terlebih dahulu!
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Data Analitik Event
          </h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleWithdraw(dashboardData.event.id)}>
            Withdraw Pendapatan
          </Button>
          <Link
            href={`/users/channels/events/update/${params.id}`}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "hover:text-primary"
            )}
          >
            Edit Event
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pendapatan
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
                Jumlah Member Event
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
                {dashboardData?.totalMember ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +100% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-4 p-4 pt-6">
          <MemberTable data={dashboardData?.members ?? []} key={"email"} />
        </div>
      </div>
    </ScrollArea>
  );
}
