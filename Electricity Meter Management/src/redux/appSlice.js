import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: '',
    userType: 'admin',
    user: {},
    isLoading: false
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
        },
        setIsLoadingR:(state,action)=>{
            console.log(action);
            state.isLoading = action.payload.isLoading
        }
    }
})

export const {setAccessToken, setUserType, setUser, setIsLoadingR} = appSlice.actions;
export default appSlice.reducer;