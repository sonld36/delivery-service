import { AlertColor } from "@mui/material";
import { ToastState } from "./types";
export const message = {
  LOGGED: "Đăng nhập thành công!",
  PASSWORD_NOT_MATCHED: "Mật khẩu không đúng, hãy thử lại!",
  USER_NOT_EXISTED: "Tên tài khoản không tồn tại, hãy thử lại!",
  SIGNUP_SUCCESSFUL: "Đăng ký thành công!",
  EMAIL_EXISTED: "Email đã tồn tại, hãy thử email khác!",
  WELCOME: "Xin chào, ",
  PARTNERS_REGISTRATION_SUCCESS:
    "Bạn đã gửi yêu cầu đăng ký đối tác thành công!",
  PARTNERS_REGISTRATION_EXIST:
    "Không thành công do bạn đã đăng kí, vui lòng đợi phản hồi!",
  PRODUCT_CREATE_SUCCESSFUL: "Tạo sản phẩm thành công!",
  PRODUCT_EXISTED: "Sản phẩm đã tồn tại",
  PRODUCT_PASSED_INVALID: "Giá nhập vào không hợp lệ, vui lòng nhập lại",
  PRODUCT_UPDATE_SUCCESSFUL: "Cập nhật sản phẩm thành công!",
  DELETE_SUCCESSFUL: "Xóa sản phẩm thành công!",
  CUSTOMER_CREATE_SUCCESSFUL: "Tạo khách hàng thành công!",
  CUSTOMER_EXISTED: "Khách hàng đã tồn tại",
  CREATE_ADDRESS_SUCCESSFUL: "Tạo địa chỉ thành công!",
  CREATE_ORDER_SUCCESSFUL: "Tạo đơn hàng thành công",
  INVALID: "Chưa thành công",
  ADDRESS_DELETED: "Xóa địa chỉ thành công",
  NOT_SUCCESSFUL: "Không thành công",
  CANCEL_ORDER_SUCCESS: "Hủy đơn thành công",
  UPDATE_ACCOUNT_SUCCESSFUL: "Cập nhật thông tin thành công",
  UPDATE_STATUS_SUCCESSFUL: "Đối soát thành công!",
};

export const status: { [key: string]: AlertColor | undefined } = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  SUCCESS: "success",
};

export const ProductToastPayload: {
  [key: number | string]: ToastState;
} = {
  2002: {
    open: true,
    message: message.PRODUCT_CREATE_SUCCESSFUL,
    status: status.SUCCESS,
  },

  2005: {
    open: true,
    message: message.PRODUCT_UPDATE_SUCCESSFUL,
    status: status.SUCCESS,
  },

  2006: {
    open: true,
    message: message.DELETE_SUCCESSFUL,
    status: status.SUCCESS,
  },

  4008: {
    open: true,
    message: message.PRODUCT_EXISTED,
    status: status.ERROR,
  },

  4001: {
    open: true,
    message: message.PRODUCT_PASSED_INVALID,
    status: status.ERROR,
  },
};

export const OrderToastPayload: {
  [key: number | string]: ToastState;
} = {
  2002: {
    open: true,
    message: message.CREATE_ORDER_SUCCESSFUL,
    status: status.SUCCESS,
  },
  2006: {
    open: true,
    message: message.CANCEL_ORDER_SUCCESS,
    status: status.SUCCESS,
  },

  4001: {
    open: true,
    message: message.INVALID,
    status: status.ERROR,
  },
};

export const AccountToastPayload: {
  [key: number | string]: ToastState;
} = {
  2008: {
    open: true,
    message: message.UPDATE_ACCOUNT_SUCCESSFUL,
    status: status.SUCCESS,
  },
  4001: {
    open: true,
    message: message.INVALID,
    status: status.ERROR,
  },
};

export const OrderControlToastPayload: {
  [key: number | string]: ToastState;
} = {
  2005: {
    open: true,
    message: message.UPDATE_STATUS_SUCCESSFUL,
    status: status.SUCCESS,
  },
  4001: {
    open: true,
    message: message.INVALID,
    status: status.ERROR,
  },
};

export const CustomerToastPayload: {
  [key: number | string]: ToastState;
} = {
  2002: {
    open: true,
    message: message.CUSTOMER_CREATE_SUCCESSFUL,
    status: status.SUCCESS,
  },
  2006: {
    open: true,
    message: message.ADDRESS_DELETED,
    status: status.SUCCESS,
  },
  2007: {
    open: true,
    message: message.CREATE_ADDRESS_SUCCESSFUL,
    status: status.SUCCESS,
  },
  4001: {
    open: true,
    message: message.NOT_SUCCESSFUL,
    status: status.ERROR,
  },

  4008: {
    open: true,
    message: message.CUSTOMER_EXISTED,
    status: status.ERROR,
  },
};

export const ToastPayload: {
  [key: number | string]: ToastState;
} = {
  2001: {
    open: true,
    message: message.LOGGED,
    status: status.SUCCESS,
  },

  4002: {
    open: true,
    message: message.PASSWORD_NOT_MATCHED,
    status: status.ERROR,
  },

  4011: {
    open: true,
    message: message.USER_NOT_EXISTED,
    status: status.ERROR,
  },

  2003: {
    open: true,
    message: message.SIGNUP_SUCCESSFUL,
    status: status.SUCCESS,
  },

  2004: {
    open: true,
    message: message.PARTNERS_REGISTRATION_SUCCESS,
    status: status.SUCCESS,
  },

  4003: {
    open: true,
    message: message.EMAIL_EXISTED,
    status: status.ERROR,
  },

  4005: {
    open: true,
    message: message.PARTNERS_REGISTRATION_EXIST,
    status: status.ERROR,
  },
};

export const ToastPayloadCustom = {
  welcome: (username: string): ToastState => {
    return {
      open: true,
      message: message.WELCOME + username,
      status: status.INFO,
    };
  },
};
