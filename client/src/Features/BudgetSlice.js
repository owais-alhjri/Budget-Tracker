import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    budget:[],
};

export const createBudget = createAsyncThunk('budgets/createBudget',
    async(budgetData)=>{
        try{
            const response = await axios.post("http://localhost:3001/createBudget",{
                budgetName:budgetData.budgetName,
                Amount:budgetData.Amount,
            });
            const budget = response.data.budget;
            return budget;
            
        }catch(error){
            console.log(error);
            alert(error);
            throw new Error(error);
        }
    
    });
export const budgetSlice = createSlice({
    name:'budgets',
    initialState,
    reducers:{
        addBudget:(state, action)=>{
            state.budget.push(action.payload);
        },
        addExpense:(state, action)=>{
            state.budget.push(action.payload);
        },
    }
});
export const {addBudget} = budgetSlice.actions;
export default budgetSlice.reducer;