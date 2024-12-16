import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import url from "../../Url";

const initialState = {
  data: {},
  isLoading: false,
  error: {},
};

export const loginUser = createAsyncThunk(
  "login/user",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login/user`, credentials,{
        headers:{
          "ngrok-skip-browser-warning": "69420",
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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

const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.data = { ...state.data,userProfile: action.payload };
        state.isLoading = false;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.error = { userProfileError: action.payload };
        state.isLoading = false;
      });
  },
});

export default loginSlice.reducer;