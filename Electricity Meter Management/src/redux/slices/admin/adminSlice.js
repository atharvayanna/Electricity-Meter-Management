import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import url from "../../../Url";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;
      const res = await axios.get(`${url}/users`, {
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

export const getAllMeterRecord = createAsyncThunk(
  "admin/getAllMeterRecords",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;
      const res = await axios.get(`${url}/meterRecord`, {
        headers: {
          Authorization: `${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.message);
    }
  }
);

export const updateMeterRecord = createAsyncThunk(
  "/admin/updateRecord",
  async ({ reading_id, formData }, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.app.accessToken;
    try {
      const res = await axios.put(
        `${url}/meterRecord/${reading_id}`,
        formData,
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

export const deleteMeterRecord = createAsyncThunk(
  "admin/deleteRecord",
  async (reading_id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;
      const res = await axios.patch(
        `${url}/meterRecord/${reading_id}`,
        {},
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

export const addMeterRecord = createAsyncThunk(
  "admin/addRecord",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.app.accessToken;

      const res = await axios.post(
        `${url}/meterRecord/createMeterRecord`,formData,
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

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMeterRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMeterRecord.fulfilled, (state, action) => {
        state.data = {
          ...state.data,
          allMeterRecords: action.payload.meterRecords,
        };
      })
      .addCase(getAllMeterRecord.rejected, (state, action) => {
        state.error = { ...state.error, allMeterRecords: action.payload };
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.data = { ...state.data, allUsers: action.payload.userData };
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = { ...state.error, allUsers: action.payload };
      });
  },
});

export default adminSlice.reducer;
