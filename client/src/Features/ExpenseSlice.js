import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    expense:[],
};

export const UpdateExpense = createAsyncThunk(
    "expense/EditExpense",
    async (expenseData) => {
      try {
        const { id, ...data } = expenseData; 
        const response = await axios.put(
          `http://localhost:3001/EditExpense/${id}`,
          data 
        );
        const expense = response.data.expense;
        alert("Expense Edited successfully");
        return expense;
        
      } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
      }
    }
  );

export const deleteExpense = createAsyncThunk(
    '/expenses/deleteExpense',
    async(expenseId)=>{
        try{
            await axios.delete(`http://localhost:3001/deleteExpense/${expenseId}`);
            return expenseId;
        }catch(error){
            console.error("Error deleting expense:", error);
            alert("Failed to delete expense. Please try again.");
        }
    }
);

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