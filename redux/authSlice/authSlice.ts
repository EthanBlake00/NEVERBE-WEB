import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableUser } from "@/interfaces";

interface AuthSlice {
  user: SerializableUser | null;
}

const initialState: AuthSlice = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializableUser | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
