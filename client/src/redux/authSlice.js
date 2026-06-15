import {createSlice} from "@reduxjs/toolkit";
import { loadUser } from "../utils/storageHandler";

const initialUser = loadUser();

const slice = createSlice({
    name:'auth',
    initialState:{
        user:initialUser,
        isAuthenticated: !!initialUser,
        allUsers:[],
       
    },
reducers:{
    register(state,action){
        state.user=action.payload; state.isAuthenticated = true;
        localStorage.setItem('user',JSON.stringify(action.payload));
    },
    login(state,action){
        state.user=action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('user',JSON.stringify(action.payload));
    },
    signout(state){
        state.user=null;
        state.isAuthenticated = false;
         
        localStorage.removeItem('user');
       
    }, 
   
}




});

export const {register,login,signout} = slice.actions;
export default slice.reducer;