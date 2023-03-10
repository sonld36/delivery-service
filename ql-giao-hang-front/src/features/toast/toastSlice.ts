import { RootState } from "@App/store";
import { ToastState } from "@Common/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state

// Define the initial state using that type
const initialState: ToastState = {
  status: undefined,
  message: "",
  open: false,
};

export const toastSlice = createSlice({
  name: "toast",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openToast: (state, action: PayloadAction<ToastState>) => {
      state = {
        ...state,
        ...action.payload,
      };

      return state;
    },

    closeToast: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { openToast, closeToast } = toastSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectToast = (state: RootState) => state.toast;

export default toastSlice.reducer;
