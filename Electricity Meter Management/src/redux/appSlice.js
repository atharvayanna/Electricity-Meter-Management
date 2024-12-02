import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: '',
    userType: 'user'
}

export const appSlice = createSlice({
    name:'appSlice',
    initialState,
    reducers:{
        setAccessToken:(state, action)=>{
            state.accessToken = action.payload.accessToken
        },
        setUserType:(state, action) => {
            state.userType = action.payload.userType
        }
    }

})

export const {setAccessToken, setUserType} = appSlice.actions;
export default appSlice.reducer;