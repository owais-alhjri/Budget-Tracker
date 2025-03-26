import { createSlice } from "@reduxjs/toolkit";
import { UsersData } from "../Exampledata";

const initialState = {
    value:UsersData,
};

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers:{
        addUser:(state, action)=>{
            state.value.push(action.payload);
        },
        deleteUser:(state, action)=>{
            state.value = state.value.filter((user)=>user.email !== action.payload);
        },
    }
});

export const {addUser,deleteUser} = userSlice.actions;
export default userSlice.reducer;