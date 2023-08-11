import { shopLink } from "@Components/dashboard/shop/Sidebar";

export const orderStatus: {
  [key: string]: string;
} = {
  REQUEST_SHIPPING: "Yêu cầu vận chuyển",
  PICKING_UP_GOODS: "Đang lấy hàng",
  BEING_TRANSPORTED: "Đang vận chuyển",
  DELIVERY_SUCCESSFUL: "Giao hàng thành công",
  REFUNDS: "Hoàn đơn",
  DONE: "Hoàn thành",
  CANCEL: "Hủy đơn",
  RETURN: "Trả đơn",
};

export const orderShopStatus: {
  [key: string]: string;
} = {
  REQUEST_SHIPPING: "Yêu cầu vận chuyển",
  PICKING_UP_GOODS: "Đang lấy hàng",
  BEING_TRANSPORTED: "Đang vận chuyển",
  DELIVERY_SUCCESSFUL: "Giao hàng thành công",
  REFUNDS: "Hoàn đơn",
  CANCEL: "Hủy đơn",
  RETURN: "Trả đơn",
};
export const orderShopStatusColor: {
  [key: string]: any;
} = {
  REQUEST_SHIPPING: "secondary",
  PICKING_UP_GOODS: "info",
  BEING_TRANSPORTED: "warning",
  DELIVERY_SUCCESSFUL: "success",
  REFUNDS: "error",
  CANCEL: "default",
  RETURN: "error",
};

export const orderStatusColor: {
  [key: string]: any;
} = {
  WAITING_FOR_ACCEPT_NEW_ORDER: "primary",
  REQUEST_SHIPPING: "secondary",
  PICKING_UP_GOODS: "info",
  BEING_TRANSPORTED: "warning",
  DELIVERY_SUCCESSFUL: "success",
  REFUNDS: "error",
  DONE: "default",
  CANCEL: "default",
  RETURN: "error",
};

export const orderType: {
  [key: string]: string;
} = {
  COD: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

export const orderTypeColor: {
  [key: string]: any;
} = {
  COD: "warning",
  PAID: "success",
};

export const productStatusColor: {
  [key: string]: any;
} = {
  ACTIVE: "success",
  INACTIVE: "warning",
};

export const pageTitle = {
  wrong: "Tiêu đề",
  [`/shop`]: "Tổng quan",
  [`/shop/${shopLink.CREATE_ORDER}`]: "Tạo đơn hàng",
  [`/shop/${shopLink.CREATE_PROD}`]: "Tạo sản phẩm",
  [`/shop/${shopLink.CUSTOMER_LIST}`]: "Khách hàng",
  [`/shop/${shopLink.ORDER_LIST}`]: "Danh sách đơn hàng",
  [`/shop/${shopLink.PRODUCT_LIST}`]: "Danh sách sản phẩm",
  [`/shop/${shopLink.CONTROL_COD}`]: "Đối soát đơn",
  [`/ql-giao-hang`]: "Tổng quan",
  [`/ql-giao-hang/them-nhan-vien`]: "Thêm nhân viên",
  [`/ql-giao-hang/danh-sach-nhan-vien`]: "Danh sách nhân viên",
  [`/ql-giao-hang/danh-sach-khach-hang`]: "Danh sách khách hàng",
  [`/ql-giao-hang/khach-hang-dang-ky/:id`]: "Đơn đăng kí đối tác",
  [`/ql-giao-hang/ds-khach-hang-dang-ky`]: "Danh sách đăng kí đối tác",
  [`/ql-giao-hang/thong-tin-khach-hang`]: "Thông tin khách hàng",
  [`/ql-giao-hang/hach-toan-COD`]: "Đối soát",
  [`/dieu-phoi`]: "Tổng quan",
  [`/dieu-phoi/quan-ly-don-hang`]: "Quản lý đơn hàng",
  [`/dieu-phoi/quan-ly-nv-giao-hang`]: "Quản lý nhân viên giao hàng",
};

export enum shopStatus {
  REGISTERING = "Chờ chấp nhận",
  ACCEPTED = "Đối tác",
}

export enum SocketTopic {
  NOTIFY = "notify",
  STATUS_UPDATE = "status_update",
  LOG = "log",
  LOCATION = "location",
}

export enum OrderLogTopic {
  ALL = "/order/all",
}

export enum OrderLogAction {
  ORDER_LOG_ACTION_CREATED = "ORDER_LOG_ACTION_CREATED",
  ORDER_LOG_ACTION_UPDATED = "ORDER_LOG_ACTION_UPDATED",
  ORDER_LOG_ACTION_DELETE = "ORDER_LOG_ACTION_DELETE",
}
