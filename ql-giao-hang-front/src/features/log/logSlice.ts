import { RootState } from "@App/store";
import { OrderLogAction, orderStatus } from "@Common/const";
import { OrderLogType, OrderStatus } from "@Common/types";
import orderService from "@Services/order.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type LogType = {
  message: string;
  createdAt: Date;
};

export type LogStateType = {
  currentPage: number;
  logs: LogType[];
  totalPage: number;
};

const initialState: LogStateType = {
  currentPage: 1,
  logs: [],
  totalPage: 1,
};

const getMessage = (item: OrderLogType) => {
  console.log(item.action);

  switch (item.action) {
    case OrderLogAction.ORDER_LOG_ACTION_CREATED: {
      return {
        createdAt: item.createdAt,
        message: `${item.account.name} tạo một đơn hàng mới #${item.order.id}`,
      } as LogType;
    }
    case OrderLogAction.ORDER_LOG_ACTION_UPDATED: {
      return {
        createdAt: item.createdAt,
        message: `${item.account.name} thay đổi trạng thái đơn hàng #${
          item.order.id
        } thành ${orderStatus[item.toStatus]}`,
      } as LogType;
    }
    default:
      return {
        createdAt: item.createdAt,
        message: `${item.account.name} hủy đơn hàng #${item.order.id}`,
      } as LogType;
  }
};

export const fetchAllOrderLog = createAsyncThunk(
  "order-log/get-all",
  async (page: number) => {
    const resp = await orderService.getOrderLog(page);
    const data = resp.data;

    return {
      currentPage: page,
      logs: data.orderLogs.map((item) => getMessage(item)),
      totalPage: data.totalPage,
    } as LogStateType;
  }
);

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAllOrderLog.fulfilled, (state, action) => {
      const resp: LogStateType = action.payload;
      state = {
        ...resp,
      };

      return state;
    });
  },
});

// export const {  } = logSlice.actions
export const selectLog = (state: RootState) => state.log;

export default logSlice.reducer;
