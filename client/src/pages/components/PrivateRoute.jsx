import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const authState = useSelector((state) => state.auth);
  const token = authState.token;
  const userRole = authState.user?.role;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole === 'admin' && rest.path === '/') {
    return <Navigate to="/super-admin" />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;
