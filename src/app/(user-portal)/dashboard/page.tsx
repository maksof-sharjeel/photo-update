"use client";
import { BarCharts } from "@/components/charts/bar-chart";
import { PieCharts } from "@/components/charts/pie-chart";
import { ReportColumn } from "@/components/reportTable/column";
import { DataTable } from "@/components/shared/data-table";
import DashboardPage from "@/components/userPortal/dashboard";
import { checkLoginStatus } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  // const router=useRouter()

  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const token = localStorage.getItem('sessionToken');

  //   if (token) {
  //     checkLoginStatus();
  //   } else {
  //     router.push(``);
  //   }
  //   setLoading(false);
  // }, []);
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div>
      <h1 className="md:text-3xl text-2xl font-bold text-[#5a5959] md:text-left text-center">
        <span className="text-green-600 ">Hello,</span>Waqar Rana
      </h1>
      <p className="text-base font-medium md:text-left text-center">
        Welcome to your Waste Management Dashboard
      </p>
      <DashboardPage />
      <div className="grid grid-cols-2  mt-5 gap-5">
        <PieCharts />
        <BarCharts/>
      </div>
      <div className="mt-5 overflow-x-auto">
        <DataTable columns={ReportColumn} data={[]} />
      </div>
    </div>
  );
};

export default Dashboard;
