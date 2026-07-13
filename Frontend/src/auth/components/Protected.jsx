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
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default Protected;
