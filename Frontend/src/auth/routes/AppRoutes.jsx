import React from "react";
import { Routes, Route } from "react-router";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Landing from "../pages/Landing.jsx";
import Loader from "../components/Loader.jsx";
import Dashboard from "../../interview/pages/Dashboard.jsx";
import Report from "../../interview/pages/Report.jsx";
import MainLayout from "../../interview/layouts/MainLayout.jsx";
import Protected from "../components/Protected.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/api/v1/auth/register" element={<Register />} />
      <Route path="/api/v1/auth/login" element={<Login />} />
      <Route path="/loading" element={<Loader />} />
      <Route element={<Protected />}>
        <Route element={<MainLayout />}>
          <Route path="/api/v1/interview/dashboard" element={<Dashboard />} />
          <Route path="/api/v1/interview/report" element={<Report />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
