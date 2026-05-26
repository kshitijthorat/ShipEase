import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthSession } from "../utils/auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const session = getAuthSession();

  if (!session?.token || !session?.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
