import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminOnlyRoute = ({ element: Element, ...rest }) => {
  const authState = useSelector((state) => state.auth);
  const token = authState.token;
  const userRole = authState.user?.role;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return <Element {...rest} />;
};

export default AdminOnlyRoute;
