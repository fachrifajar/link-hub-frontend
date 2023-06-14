import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.data = action.payload;
    },
    deleteAuth(state) {
      state.data = null;
    },
  },
});

export const { setAuth, deleteAuth } = authSlice.actions;
export default authSlice.reducer;
