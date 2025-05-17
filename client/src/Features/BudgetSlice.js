import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const initialState = {
    budget:[],
    category:null,
    expenses:[],
};

export const deleteBudget = createAsyncThunk(
  "/budgets/deleteBudget",
  async (budgetId, { dispatch }) => {
    try {
      await axios.delete(`${API_URL}/deleteBudget/${budgetId}`);
      alert("The budget and its associated expenses have been deleted successfully");
      return budgetId;
    } catch (error) {
      console.error("Error deleting budget and expenses:", error);
      alert("Failed to delete the budget and its associated expenses. Please try again.");
      throw error;
    }
  }
);

export const createBudget = createAsyncThunk('budgets/createBudget',
    async(budgetData)=>{
        try{
            const response = await axios.post(`${API_URL}/createBudget`,{
                budgetName:budgetData.budgetName,
                Amount:budgetData.Amount,
                user:budgetData.user,
                color:budgetData.color,
            });
            const budget = response.data.budget;
            alert("budget has been created successfully");
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
        setBudgetDetails:(state, action)=>{
            state.category = action.payload.category;
            state.expenses = action.payload.expenses;
        },
        clearBudgetDetails:(state, action)=>{
            state.category = null;
            state.expenses = [];
        },
    }
});
export const {addExpense,addBudget, setBudgetDetails,clearBudgetDetails} = budgetSlice.actions;
export default budgetSlice.reducer;