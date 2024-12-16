import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import url from "../../../Url";

const initialState = {
  data: {},
  isLoading: false,
  error: {},
};

export const userMeterData = createAsyncThunk(
  "user/getMeterData",
  async (currentMeter, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;
      const res = await axios.get(`${url}/meterReading/user/${currentMeter}`, {
        headers: {
          Authorization: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/profile",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;
      const res = await axios.get(`${url}/profile/user/${userId}`,{
        headers:{
          Authorization:`${token}`,
          "ngrok-skip-browser-warning": "69420"
        }
      })
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userMeterData.fulfilled, (state, action) => {
      state.data = { ...state.data, userMeterData: action.payload };
    });
  },
});

export default userSlice.reducers;
