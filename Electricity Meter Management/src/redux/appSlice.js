import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: '',
    userType: 'admin',
    user: {}
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
        }, 
        setUser:(state,action) =>{
            state.user = action.payload.userDetails
        }
    }

})

export const {setAccessToken, setUserType, setUser} = appSlice.actions;
export default appSlice.reducer;