import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import url from "../../../Url";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

export const getUserProfile = createAsyncThunk(
  "profile/user",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;

      const res = await axios.get(`${url}/profile/user/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.message);
    }
  }
);

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        // console.log("User profile fetched successfully:", action);
        state.data = { ...state.data,userProfile: action.payload };
        state.isLoading = false;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.error = { userProfileError: action.payload };
        state.isLoading = false;
      });
  },
});

export default adminSlice.reducer;