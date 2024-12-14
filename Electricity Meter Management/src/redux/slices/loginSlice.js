import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import url from "../../Url";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "login/user",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login/user`, credentials);
      return response.data; // Return the data directly to be used in the component
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error to handle in the component
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
      });
  },
});

export default loginSlice.reducer;
// export { loginUser };