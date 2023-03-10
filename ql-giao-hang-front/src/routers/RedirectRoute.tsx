import { useAppSelector } from '@App/hook';
import { selectUser } from '@Features/user/userSlice';
import { Navigate } from 'react-router';

type Props = {
  children?: JSX.Element,
}

function RedirectRoute(props: Props) {
  const { children } = props;

  const auth = useAppSelector(selectUser);

  const { user } = auth;

  if (!!user && (user.role === "ROLE_USER" || user.role === "ROLE_SHOP")) {
    return <Navigate to={"/shop"} replace />
  } else if (!!user && (user.role === "ROLE_DELIVERY_MANAGER")) {
    return <Navigate to={"/ql-giao-hang"} replace />
  } else if (!!user && (user.role === "ROLE_CARRIER")) {
    return <Navigate to={"/shipper"} replace />
  } else if (!!user && (user.role === "ROLE_COORDINATOR")) {
    return <Navigate to={"/dieu-phoi"} replace />
  }


  return children ? children : <Navigate to={"/login"} replace />;

}

export default RedirectRoute