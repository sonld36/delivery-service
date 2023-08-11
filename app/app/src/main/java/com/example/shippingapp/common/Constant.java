package com.example.shippingapp.common;

public class Constant {
    public enum OrderStatus {

        REQUEST_SHIPPING("Yêu cầu vận chuyển"),
        PICKING_UP_GOODS("Đang lấy hàng"),
        BEING_TRANSPORTED("Đang vận chuyển"),
        DELIVERY_SUCCESSFUL("Giao hàng thành công"),
        REFUNDS("Hoàn đơn"),
        CANCEL("Hủy đơn"),
        RETURN("Trả đơn"),
        DONE("Đã hoàn tiền")
        ;


        private String status;

        OrderStatus(String status) {
            this.status = status;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public enum Code {

        OK(2000),
        LOGGED_IN(2001),
        CREATED_SUCCESS(2002),
        SIGNUP_SUCCESSFUL(2003),

        PARTNERS_REGISTRATION_SUCCESS(2004),

        UPDATE_SUCCESSFUL(2005),

        DELETE_SUCCESSFUL(2006),
        CREATE_ADDRESS_SUCCESSFUL(2007),
        UPDATE_ACCOUNT_SUCCESSFUL(2008),

        TAKE_A_ORDER_SUCCESSFUL(2009),


        INVALID(4001),
        PASSWORD_NOT_MATCHES(4002),
        EMAIL_EXISTED(4003),

        ACCOUNT_NOT_EXISTED(4004),

        EXISTED(4008),

        NOT_EXITED(4007),

        CUSTOMER_NOT_EXISTED(4006),

        USER_NOT_EXISTED(4011),

        ORDER_WAS_ASSIGNED(4009),




        ;

        private long code;

        Code(long code) {
            this.code = code;
        }

        public long getCode() {
            return code;
        }

        public void setCode(long code) {
            this.code = code;
        }
    }
}
