import React from "react";
import Navbar from "../components/Navbar.jsx";
import PreviousReport from "../components/PreviousReport.jsx";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <PreviousReport />
    </>
  );
};

export default MainLayout;
