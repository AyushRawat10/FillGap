import React from "react";
import { useAuth } from "../hooks/useAuth.hook.js";
import Loader from "./Loader.jsx";
import { Navigate, Outlet } from "react-router";

const Protected = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/api/v1/auth/login" replace />;
  }

  return <Outlet />;
};

export default Protected;
