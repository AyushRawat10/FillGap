import React from "react";
import { Routes, Route } from "react-router";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Landing from "../pages/Landing.jsx";
import Profile from "../pages/Profile.jsx";
import Loader from "../components/Loader.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/api/v1/auth/register" element={<Register />} />
      <Route path="/api/v1/auth/login" element={<Login />} />
      <Route path="/loading" element={<Loader />} />
      <Route path="/api/v1/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
