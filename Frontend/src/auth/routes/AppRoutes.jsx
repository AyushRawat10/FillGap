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
import Privacy from "../pages/Privacy.jsx";
import Terms from "../pages/Terms.jsx";
import Contact from "../pages/Contact.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/terms" element={<Terms/>} />
      <Route path="/privacy" element={<Privacy/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loading" element={<Loader />} />
      <Route path="/change-password" element={<ChangePassword/>} />
      <Route element={<Protected />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/report/:reportId" element={<Report />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
