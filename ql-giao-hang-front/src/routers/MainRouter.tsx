import Login from "@Components/auth/Login";
import Register from "@Components/auth/Register";
import CODBill from "@Components/custom-manage/CODBill";
import CustomerInfo from "@Components/custom-manage/CustomerInfo";
import CustomerRegisterApply from "@Components/custom-manage/CustomerRegisterApply";
import CustomerRegisterList from "@Components/custom-manage/CustomerRegisterList";
import Dashboard from "@Components/dashboard/Dashboard";
import CreateNewProduct from "@Components/dashboard/shop/CreateNewProduct";
import ShopOverview from "@Components/dashboard/shop/OverviewPage";
import ShopSidebar, { shopLink } from "@Components/dashboard/shop/Sidebar";
import CreateNewOrder from "@Components/order/CreateNewOrder";
import ShipManagementSidebar from "@Components/ship-manage/Sidebar";
import OrderMoneyManagement from "@Components/staff-manage/OrderMoneyManage";
import StaffList from "@Components/staff-manage/StaffList";
import StaffRegister from "@Components/staff-manage/StaffRegister";
import Toast from "@Features/toast/Toast";
//Import for coordinator
import CoordinatorSidebar, { orderManageLinks } from "@Components/coordinator/CoordinatorSidebar/CoordinatorSidebar";
import General from "@Components/coordinator/general/General";
import QuanlyNVgiaohang from "@Components/coordinator/quanlydonhang/QuanlyNVgiaohang";
import Quanlydonhang from "@Components/coordinator/quanlydonhang/Quanlydonhang";

import Account from "@Components/shipper/Account/Account";
import Detail from "@Components/shipper/Detail/Detail";
import Homepage from "@Components/shipper/Homepage/Homepage";
import ListOrderByStatus from "@Components/shipper/ListOrderByStatus/ListOrderByStatus";
import Transport from "@Components/shipper/Transport/Transport";
import UpdateShipperInfo from "@Components/shipper/UpdateShipperInfo/UpdateShipperInfo";
// import Notification from "@Components/shipper/Notification/Notification";
import { useAppSelector } from "@App/hook";
import AuthVerify from "@Common/auth-verify";
import AccessDenied from "@Components/AccessDenied";
import Profile from "@Components/Profile";
import Overview from "@Components/custom-manage/Overview";
import OrderControl from "@Components/dashboard/shop/OrderControl";
import ProductList from "@Components/dashboard/shop/ProductList";
import ShopCustomerList from "@Components/dashboard/shop/ShopCustomerList";
import OrderList from "@Components/order/OrderList";
import Customer from "@Components/ship-manage/Customer";
import { selectUser } from "@Features/user/userSlice";
import {
  Outlet, Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RedirectRoute from "./RedirectRoute";

export default function MainRouter() {
  const auth = useAppSelector(selectUser);

  const { user } = auth;

  // const orders = useAppSelector(selectOrder);

  // console.log("orders:", orders);

  // useEffect(() => {
  //   dispatch(fetchOrderWithPaging(1));
  // }, [])



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
