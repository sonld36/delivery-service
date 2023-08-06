import Login from "@Components/auth/Login";
import Register from "@Components/auth/Register";
import Dashboard from "@Components/dashboard/Dashboard";
import CreateNewProduct from "@Components/dashboard/shop/CreateNewProduct";
import CustomerList from "@Components/custom-manage/CustomerList";
import CustomerRegisterList from "@Components/custom-manage/CustomerRegisterList";
import CustomerInfo from "@Components/custom-manage/CustomerInfo";
import ShopOverview from "@Components/dashboard/shop/OverviewPage";
import ShopSidebar, { shopLink } from "@Components/dashboard/shop/Sidebar";
import ShipManagementSidebar from "@Components/ship-manage/Sidebar";
import CreateNewOrder from "@Components/order/CreateNewOrder";
import Toast from "@Features/toast/Toast";
import OrderMoneyManagement from "@Components/staff-manage/OrderMoneyManage";
import StaffRegister from "@Components/staff-manage/StaffRegister";
import StaffList from "@Components/staff-manage/StaffList";
import CustomerRegisterApply from "@Components/custom-manage/CustomerRegisterApply";
import CODBill from "@Components/custom-manage/CODBill";
//Import for coordinator
import General from "@Components/coordinator/general/General";
import Quanlydonhang from "@Components/coordinator/quanlydonhang/Quanlydonhang";
import CoordinatorSidebar, { orderManageLinks } from "@Components/coordinator/CoordinatorSidebar/CoordinatorSidebar";
import QuanlyNVgiaohang from "@Components/coordinator/quanlydonhang/QuanlyNVgiaohang";

import Homepage from "@Components/shipper/Homepage/Homepage";
import Transport from "@Components/shipper/Transport/Transport";
import Detail from "@Components/shipper/Detail/Detail";
import Account from "@Components/shipper/Account/Account";
import ListOrderByStatus from "@Components/shipper/ListOrderByStatus/ListOrderByStatus";
import UpdateShipperInfo from "@Components/shipper/UpdateShipperInfo/UpdateShipperInfo";
// import Notification from "@Components/shipper/Notification/Notification";
import {
  BrowserRouter as Router, Outlet, Route, Routes
} from "react-router-dom";
import ProductList from "@Components/dashboard/shop/ProductList";
import { useAppDispatch, useAppSelector } from "@App/hook";
import { selectUser } from "@Features/user/userSlice";
import ProtectedRoute from "./ProtectedRoute";
import RedirectRoute from "./RedirectRoute";
import AuthVerify from "@Common/auth-verify";
import OrderList from "@Components/order/OrderList";
import ShopCustomerList from "@Components/dashboard/shop/ShopCustomerList";
import Profile from "@Components/Profile";
import AccessDenied from "@Components/AccessDenied";
import OrderControl from "@Components/dashboard/shop/OrderControl";
import { useCallback, useEffect } from "react";
import { stompClient } from "@Services/socket.service";
import { SocketSubcribe, roles } from "@Common/socket.subcribe";
import { SocketTopic } from "@Common/const";
import { SocketMessageFormat } from "@Common/types";
import { openToast } from "@Features/toast/toastSlice";
import { status } from "@Common/toast.const";
import { fetchOrderWithPaging, selectOrder } from "@Features/order/orderSlice";
import Overview from "@Components/custom-manage/Overview";
import Customer from "@Components/ship-manage/Customer";

export default function MainRouter() {
  const auth = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const { user } = auth;

  // const orders = useAppSelector(selectOrder);

  // console.log("orders:", orders);

  // useEffect(() => {
  //   dispatch(fetchOrderWithPaging(1));
  // }, [])

  const subcribeSocket = useCallback(() => {
    switch (user.role) {
      case roles.ROLE_COORDINATOR:
        return SocketSubcribe[roles.ROLE_COORDINATOR](dispatch);
    }
  }, [user, dispatch]);

  useEffect(() => {
    stompClient.connect({}, function () {
      stompClient.subscribe(
        `/${SocketTopic.NOTIFY}`,
        (message) => {
          const resp: SocketMessageFormat<string | null> = JSON.parse(
            message.body
          );
          dispatch(
            openToast({
              open: true,
              message: resp.message,
              status: status.INFO,
            })
          );
        }
      );

      subcribeSocket();
    });
  }, [dispatch, subcribeSocket]);

  return (
    <>
      <Toast />
      <Router>
        <Routes>
          <Route index element={<RedirectRoute>
            <Login />
          </RedirectRoute>} />
          <Route path="/login" element={<RedirectRoute>
            <Login />
          </RedirectRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/redirect" element={<RedirectRoute />} />
          <Route path="/shop" element={<ProtectedRoute
            isAllowed={!!user && (user.role === "ROLE_USER" || user.role === "ROLE_SHOP")}
            redirectPath="/"
          >
            <Dashboard sidebar={<ShopSidebar />} />
          </ProtectedRoute>} >
            <Route path={`${shopLink.CREATE_ORDER}`} element={<ProtectedRoute isAllowed={!!user && (user.role === "ROLE_SHOP")}
              redirectPath="/access-denied">
              <CreateNewOrder />
            </ProtectedRoute>} />
            <Route path={`${shopLink.CREATE_PROD}`} element={<CreateNewProduct />} />
            <Route path={`${shopLink.PRODUCT_LIST}`} element={<ProductList />} />
            <Route path={`${shopLink.ORDER_LIST}`} element={<OrderList />} />
            <Route path={`${shopLink.CUSTOMER_LIST}`} element={<ProtectedRoute isAllowed={!!user && (user.role === "ROLE_SHOP")}
              redirectPath="/access-denied">
              <ShopCustomerList />
            </ProtectedRoute>} />
            <Route path={`${shopLink.PROFILE}`} element={<Profile />} />
            <Route path={shopLink.CONTROL_COD} element={<OrderControl />} />
            <Route index element={<ShopOverview />} />
          </Route>
          {/* Router for coordinator */}
          <Route path="/dieu-phoi" element={<ProtectedRoute
            isAllowed={!!user && (user.role === "ROLE_COORDINATOR")}
            redirectPath="/"
          >
            <Dashboard sidebar={<CoordinatorSidebar />} />
          </ProtectedRoute>} >
            <Route index path="" element={<General />} />
            <Route path="quan-ly-don-hang" element={<Quanlydonhang />} >
              <Route index path={orderManageLinks.ALL} />
              <Route path={orderManageLinks.REQUEST} />
              <Route path={orderManageLinks.PICKING} />
              <Route path={orderManageLinks.DELIVERING} />
              <Route path={orderManageLinks.SUCCESS} />
              <Route path={orderManageLinks.DONE} />
            </Route>
            <Route path="quan-ly-nv-giao-hang" element={<QuanlyNVgiaohang />} />
          </Route>
          {/*        */}
          <Route path="/ql-giao-hang" element={<ProtectedRoute
            isAllowed={!!user && (user.role === "ROLE_DELIVERY_MANAGER")}
            redirectPath="/"
          >
            <Dashboard sidebar={<ShipManagementSidebar />} />
          </ProtectedRoute>} >
            <Route index element={<Overview />} />
            <Route path="tien-hang/:id" element={<OrderMoneyManagement />} />
            <Route path="them-nhan-vien" element={<StaffRegister />} />
            <Route path="danh-sach-nhan-vien" element={<StaffList />} />
            <Route path="danh-sach-khach-hang" element={<Customer />} />
            <Route path="khach-hang-dang-ky/:id" element={<CustomerRegisterApply />} />
            <Route path="ds-khach-hang-dang-ky" element={<CustomerRegisterList />} />
            <Route path="thong-tin-khach-hang/:id" element={<CustomerInfo />} />
            <Route path="hach-toan-COD" element={<CODBill />} />
          </Route>

          <Route path="/shipper" element={<ProtectedRoute
            isAllowed={!!user && (user.role === "ROLE_CARRIER")}
            redirectPath="/"
          >
            <Outlet />
          </ProtectedRoute>}>
            <Route index element={<Homepage />} />
            <Route path="transport" element={<Transport />} />
            <Route path="detail/:id" element={<Detail />} />
            <Route path="account" element={<Account />} />
            <Route path="list-order" element={<ListOrderByStatus />} />
            <Route path="update" element={<UpdateShipperInfo />} />
          </Route>

          <Route path="/access-denied" element={<AccessDenied />} />

        </Routes>
        <AuthVerify />
      </Router>


    </>
  )
}
