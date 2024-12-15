import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import url from "../../../Url";

const initialState = {
  data: {},
  isLoading: false,
  error: {},
};

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (formData, { rejectWithValue, getState }) => {
      try {
        const state = getState();
        const token = state.app.accessToken;
        const res = await axios.post(
            `${url}/user/create`,formData,
            {
              headers: {
                Authorization: `${token}`,
                "ngrok-skip-browser-warning": "69420",
              },
            }
          );
        return res.data
      } catch (error) {
        return rejectWithValue(error.response.data)
      }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/delete",
  async (deletedUser, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.app.accessToken;
    try {
      const res = await axios.patch(
        `${url}/user/${deletedUser.id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      return res;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, formData }, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.app.accessToken;
    try {
      const res = await axios.put(`${url}/user/${userId}`, formData, {
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

export const addMeter = createAsyncThunk(
  "admin/addMeter",
  async (user, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;
      const res = await axios.post(
        `${url}/createMeter`,
        {
          user_id: user.id,
        },
        {
          headers: {
            Authorization: `${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const handleUserSlice = createSlice({
  name: "handleUserSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = { ...state.data, deletedUser: action.payload };
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = { ...state.error, deletedUser: action.payload };
        state.isLoading = false;
      });
  },
});

export default handleUserSlice.reducer;
