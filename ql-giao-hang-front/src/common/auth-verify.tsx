import { useAppSelector } from "@App/hook";
import { logout, selectUser } from "@Features/user/userSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = () => {
  let location = useLocation();
  const auth = useAppSelector(selectUser);
  const dispatch = useDispatch();
  const { token } = auth;

  useEffect(() => {
    if (token) {
      const decodedJwt = parseJwt(token);

      if (decodedJwt.exp * 1000 < Date.now()) {
        dispatch(logout());
      }
    }
  }, [location]);

  return <div></div>;
};

export default AuthVerify;