"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const searchParams = useSearchParams();
  const loggedIn = searchParams.get("isLoggedIn");
  const router = useRouter();

/* eslint-disable react-hooks/exhaustive-deps */
// i'm adding this to ignore the warning for missing dependencies in the useEffect below 
// coz it is necessary to add every variable used inside useEffect in dependency array

  useEffect(() => {
    if (loggedIn=='true') {
      toast.success("Logged in successfully!");
      router.replace("/dashboard");
    }
  }, [loggedIn]);

  return <div>Dashboard Coming Soon !!</div>;
};

export default Dashboard;
