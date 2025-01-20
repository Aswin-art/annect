"use client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { ReportTable } from "@/components/tables/admin/report-tables/table";
import { getAllReportData } from "@/actions/reportAction";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin" },
  { title: "Reports", link: "/admin/reports" },
];

export default function Page() {
  const [reports, setReports] = useState<any | []>([]);
  const getData = async () => {
    const req = await getAllReportData();
    setReports(req);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <Separator />

      <ReportTable data={reports} key={"event name"} />
    </div>
  );
}
