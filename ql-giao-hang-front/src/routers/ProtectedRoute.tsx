import React from 'react'
import { Navigate, Outlet } from 'react-router';

type Props = {
  isAllowed: boolean,
  redirectPath: string,
  children: JSX.Element,
}

function ProtectedRoute(props: Props) {
  const { isAllowed, redirectPath = "/", children } = props;

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute