import { AppDispatch, RootState } from "@App/store";
import { Order } from "@Common/types";
import { OrderDisplayType } from "@Common/types";
import orderService from "@Services/order.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type OrderStateType = {
  currentPage: number;
  totalPage: number;
  orderDisplayType: OrderDisplayType[] | Order[];
  isLoading: boolean;
};

const initialState: OrderStateType = {
  currentPage: 1,
  orderDisplayType: [],
  totalPage: 1,
  isLoading: false,
};

export const fetchOrderWithPaging = createAsyncThunk(
  "order/get",
  async (page: number) => {
    const resp = await orderService.getOrderWithPaging(page);
    return {
      currentPage: page,
      orderDisplayType: resp.data.orders,
      totalPage: resp.data.totalPage,
    } as OrderStateType;
  }
);

export const fetchAllOrderByDPWithPagination = createAsyncThunk(
  "order/get_all",
  async ({ page }: any) => {
    const resp = await orderService.getAllOrderByDPWithPagination(page);
    return {
      currentPage: page,
      orderDisplayType: resp.data.orders,
      totalPage: resp.data.totalRecord,
    } as OrderStateType;
  }
);

export const fetchAllOrderByStatusDPWithPagination = createAsyncThunk(
  "order/get_all_status",
  async ({ page, status }: any) => {
    const resp = await orderService.getAllOrderStatusByDPWithPagination(
      status,
      page
    );
    return {
      currentPage: page,
      orderDisplayType: resp.data.orders,
      totalPage: resp.data.totalRecord,
    } as OrderStateType;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const payload: OrderDisplayType | any = action.payload;
      const { currentPage, orderDisplayType } = state;
      if (currentPage === 1) {
        orderDisplayType.pop();
        orderDisplayType.unshift(payload);
      }

      return state;
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchOrderWithPaging.fulfilled, (state, action) => {
      const payload: OrderStateType = action.payload;
      state = {
        ...payload,
      };

      return state;
    });

    builder.addCase(
      fetchAllOrderByDPWithPagination.pending,
      (state, action) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      fetchAllOrderByDPWithPagination.fulfilled,
      (state, action) => {
        const payload: OrderStateType = action.payload;
        state = {
          ...payload,
        };
        state.isLoading = false;

        return state;
      }
    );

    builder.addCase(
      fetchAllOrderByStatusDPWithPagination.pending,
      (state, action) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      fetchAllOrderByStatusDPWithPagination.fulfilled,
      (state, action) => {
        const payload: OrderStateType = action.payload;
        state = {
          ...payload,
        };
        state.isLoading = false;
        return state;
      }
    );
  },
});

export const { addOrder } = orderSlice.actions;
export const selectOrder = (state: RootState) => state.order;

export default orderSlice.reducer;
