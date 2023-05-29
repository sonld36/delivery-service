import { RootState } from "@App/store";
import { OrderLogType } from "@Common/types";
import orderService from "@Services/order.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type LogStateType = {
  currentPage: number;
  logs: OrderLogType[];
  totalPage: number;
};

const initialState: LogStateType = {
  currentPage: 1,
  logs: [],
  totalPage: 1,
};

export const fetchAllOrderLog = createAsyncThunk(
  "order-log/get-all",
  async (page: number) => {
    const resp = await orderService.getOrderLog(page);
    const data = resp.data;
    return {
      currentPage: page,
      logs: data.orderLogs,
      totalPage: data.totalPage,
    } as LogStateType;
  }
);

export const fetchAllOrderLogForShop = createAsyncThunk(
  "order-log/get-for-shop",
  async (page: number) => {
    const resp = await orderService.getOrderLogForShop(page);
    const data = resp.data;
    return {
      currentPage: page,
      logs: data.orderLogs,
      totalPage: data.totalPage,
    } as LogStateType;
  }
);

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    addNewLog: (state, action) => {
      const data = action.payload;

      state.logs.pop();
      state.logs.unshift(data);

      return state;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAllOrderLog.fulfilled, (state, action) => {
      const resp: LogStateType = action.payload;
      state = {
        ...resp,
      };

      return state;
    });
    builder.addCase(fetchAllOrderLogForShop.fulfilled, (state, action) => {
      const resp: LogStateType = action.payload;
      state = {
        ...resp,
      };

      return state;
    });
  },
});

export const { addNewLog } = logSlice.actions;
export const selectLog = (state: RootState) => state.log;

export default logSlice.reducer;
