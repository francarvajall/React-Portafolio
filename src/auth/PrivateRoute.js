import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./index";

const PrivateRoute = ({ children }) => {
  if (isAuthenticated()) {
    return children;
  } else {
    return <Navigate to="/signin" />;
  }
};

export default PrivateRoute;
