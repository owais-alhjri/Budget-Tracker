import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    expense:[],
};

export const createExpense = createAsyncThunk('expenses/createExpense',
    async(expenseData)=>{
        try{
            const response = await axios.post("http://localhost:3001/createExpense",{
                ExpenseName:expenseData.expenseName,
                ExpenseAmount:expenseData.expenseAmount,
                category:expenseData.Category,
                user:expenseData.user,

            });
            const expense = response.data.expense;
            return expense;
        }catch(error){
            console.error("Error creating expense:", error);
            alert("Failed to create expense. Please try again.");
            throw new Error(error);
        }});
export const expenseSlice = createSlice({
    name:'expenses',
    initialState,
    reducers:{

        addExpense:(state, action)=>{
            state.expense.push(action.payload);
        },
    }
});

export const {addExpense} = expenseSlice.actions;
export default expenseSlice.reducer;