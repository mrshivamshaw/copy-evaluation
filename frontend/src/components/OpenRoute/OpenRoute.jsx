import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const { accountType } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(`/${accountType}/dashboard`);
    }
  }, [token, accountType, navigate]); // Dependencies ensure it runs when values change

  if (!token) {
    return children; // Allow access if user is not logged in
  }

  return null; // Prevent rendering anything while navigating
};

export default OpenRoute;
