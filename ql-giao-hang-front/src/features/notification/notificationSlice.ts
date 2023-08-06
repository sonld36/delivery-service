import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type NotificationType = {
  id: number;
  message: string;
  title: string;
  seen: boolean;
  destination: string;
  from: string;
  createdAt: Date;
};

export type NotificationStateType = {
  currentPage?: number;
  totalPage?: number;
  numberNotificationNotSeen?: number;
  notification?: NotificationType[];
};

const initialState: NotificationStateType = {
  currentPage: 1,
  totalPage: 0,
  numberNotificationNotSeen: 0,
  notification: [],
};

export const fetchNotification = createAsyncThunk(
  "notification/get-for-user",
  async (page: number) => {}
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers(builder) {},
});
