import { AppDispatch } from "@App/store";
import { openToast } from "@Features/toast/toastSlice";
import { stompClient } from "@Services/socket.service";
import { OrderLogTopic, SocketTopic } from "./const";
import { status } from "./toast.const";
import { OrderDisplayType, OrderLogType, SocketMessageFormat } from "./types";
import { addOrder } from "@Features/order/orderSlice";
import { addNewLog } from "@Features/log/logSlice";

export const roles = {
  ROLE_SHOP: "ROLE_SHOP",
  ROLE_CARRIER: "ROLE_CARRIER",
  ROLE_DELIVERY_MANAGER: "ROLE_DELIVERY_MANAGER",
  ROLE_COORDINATOR: "ROLE_COORDINATOR",
};

export const eventSocket = {
  createOrder: "create_order",
};

export const SocketSubcribe: {
  [key: string]: (dispatch: AppDispatch) => void;
} = {
  [roles.ROLE_COORDINATOR]: function (dispatch: AppDispatch) {
    // theo dõi kênh thay đổi tạo đơn hàng
    // stompClient.subscribe(
    //   `/${SocketTopic.CREATED}/${eventSocket.createOrder}/3`,
    //   (message) => {
    //     const resp: SocketMessageFormat<OrderDisplayType> = JSON.parse(
    //       message.body
    //     );
    //     const newOrder: OrderDisplayType = resp.data;
    //     dispatch(addOrder(newOrder));
    //   }
    // );

    stompClient.subscribe(
      `/${SocketTopic.LOG}${OrderLogTopic.ALL}`,
      (message) => {
        const resp: OrderLogType = JSON.parse(message.body);
        dispatch(addNewLog(resp));
      }
    );
  },
};
