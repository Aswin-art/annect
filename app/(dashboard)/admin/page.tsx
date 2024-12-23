"use client";
import { getDashboardData } from "@/actions/dashboardAction";
import { AreaGraph } from "@/components/charts/area-graph";
import { TransactionChart } from "@/components/charts/transaction-chart";
import { PieGraph } from "@/components/charts/pie-graph";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";
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
import { events, users } from "@prisma/client";
import { useEffect, useState } from "react";
import { BarGraph } from "@/components/charts/bar-graph";
import axios from "axios";
import { ethers } from "ethers";
import ABI from "@/constants/abi.json";
import toast from "react-hot-toast";

const DEFAULT_ADDRESS_URL = process.env.NEXT_PUBLIC_WEB3_ADDRESS_URL ?? "";
const DEFAULT_CHAIN_ID = BigInt(17000);

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

type DashboardData = {
  // events: events[];
  eventCount: { date: string; count: number }[];
  eventTotal: number;
  user: users[];
  userTotal: number;
  chanelTotal: number;
  // channels: chanels[];
  totalIncome: number;
  countEventRunning: number;
  eventRunning: events[];
  transaction: TransactionType[];
};

export default function Page() {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [loading, setLoading] = useState(false);
  const [profit, setProfit] = useState(0);

  const getWebThree = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("Ethereum provider tidak ditemukan. Install MetaMask.");
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== DEFAULT_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.toQuantity(DEFAULT_CHAIN_ID) }],
          });
        } catch (switchError: unknown) {
          if (isSwitchError(switchError)) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: ethers.toQuantity(DEFAULT_CHAIN_ID),
                      chainName: "Holesky Testnet",
                      nativeCurrency: {
                        name: "Ethereum",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      rpcUrls: ["https://rpc.holesky.io"],
                      blockExplorerUrls: ["https://explorer.holesky.io"],
                    },
                  ],
                });
              } catch (addError) {
                console.error("Gagal menambahkan jaringan Holesky:", addError);
                alert(
                  "Gagal menambahkan jaringan Holesky. Ganti jaringan secara manual."
                );
                return null;
              }
            } else {
              console.error("Gagal mengganti jaringan:", switchError);
              alert("Gagal mengganti jaringan. Ganti jaringan secara manual.");
              return null;
            }
          } else {
            console.error(
              "Error tidak diketahui saat mengganti jaringan:",
              switchError
            );
            alert(
              "Terjadi error yang tidak diketahui. Ganti jaringan secara manual."
            );
            return null;
          }
        }
      }

      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(DEFAULT_ADDRESS_URL, ABI, signer);

      return { provider, signer, contract };
    } catch (error) {
      console.error("Error setting up provider, signer, or contract:", error);
      return null;
    }
  };

  function isSwitchError(error: unknown): error is { code: number } {
    return typeof error === "object" && error !== null && "code" in error;
  }

  const handleWithdrawAdminFund = async () => {
    setLoading(true);
    try {
      const web = await getWebThree();

      if (!web) {
        toast.error("Error connecting to wallet!");
        return false;
      }

      const res = await web.contract.withdrawAdminFee();

      if (res) {
        toast.success("Withdrawal successfull!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Network error!");
      return false;
    }
    setLoading(false);
  };

  const getData = async () => {
    const response = await fetch(`/api/dashboard/admin`);
    const responseData = await response.json();
    setDashboardData(responseData.data);
  };

  const fetchVisitorCount = async () => {
    // try {
    //   const response = await axios.get("https://api.statcounter.com/v3/stats", {
    //     params: {
    //       api_key: "5317e0c0",
    //       project_id: "13071665",
    //       stat_type: "visitors",
    //     },
    //   });
    //   const count = response.data.totals.visitors || 0;
    //   console.log("Visitor count:", count);
    // } catch (error) {
    //   console.error("Error fetching visitor count:", error);
    // }
  };

  const fetchProfit = async () => {
    const webThree = await getWebThree();
    if (!webThree) {
      toast.error("Error connecting to wallet!");
      return false;
    }

    try {
      const data = await webThree.contract.CheckProfit();
      const profit = data.toString();
      const profitInEth = parseFloat(ethers.formatEther(profit));
      const ethUsd = await getEthPriceInUsd();
      const profitInUsd = profitInEth * ethUsd;
      setProfit(profitInUsd);
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  async function getEthPriceInUsd() {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const ethPriceInUsd = response.data.ethereum.usd;
      return ethPriceInUsd;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return null;
    }
  }

  useEffect(() => {
    getData();
    fetchVisitorCount();
    fetchProfit();
  }, []);
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back <span className="text-primary">Admin</span> 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earning">Pendapatan</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    {formatPrice(dashboardData?.totalIncome, "USD")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    User Total
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
                    +{dashboardData?.userTotal}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Event Running
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
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{dashboardData?.countEventRunning}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Channel yang didirikan
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    +{dashboardData?.chanelTotal}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                {/* <BarGraph /> */}
                <TransactionChart
                  chartData={dashboardData?.eventCount || []}
                  title="Bar Chart Event"
                  desc="List Event"
                />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Last Transaction</CardTitle>
                  <CardDescription>Last 5 transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData?.transaction && (
                    <RecentSales data={dashboardData.transaction} />
                  )}
                </CardContent>
              </Card>
              {/* <div className="col-span-4">
                <AreaGraph />
              </div>
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div> */}
            </div>
          </TabsContent>
          <TabsContent value="earning" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    {formatPrice(profit, "USD")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Button disabled={loading} onClick={handleWithdrawAdminFund}>
                {loading ? "loading..." : "Withdraw Pendapatan"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
