import { RootState } from "@App/store";
import { createSlice } from "@reduxjs/toolkit";
import { UserLogged } from "@Common/types";
const initialState: UserLogged = {
  user: {
    phoneNumber: "",
    id: undefined,
    role: "",
    username: "",
  },

  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state = {
        ...state,
        ...action.payload,
      };
      return state;
    },

    logout: (state) => {
      state = initialState;
      return initialState;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
