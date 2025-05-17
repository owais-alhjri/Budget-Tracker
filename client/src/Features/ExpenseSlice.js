import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const initialState = {
  expense: [],
  selectedExpenseId: null, 
};

export const UpdateExpense = createAsyncThunk(
  "expense/EditExpense",
  async (expenseData) => {
    try {
      const { id, ...data } = expenseData;
      const response = await axios.put(
        `${API_URL}/EditExpense/${id}`,
        data
      );
      const updatedExpense = response.data.expense;
      alert("Expense updated successfully");
      return updatedExpense;
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
      throw error;
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "/expenses/deleteExpense",
  async (expenseId) => {
    try {
      await axios.delete(`${API_URL}/deleteExpense/${expenseId}`);
      alert("The expense has been deleted successfully");
      return expenseId;
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
      throw error;
    }
  }
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData) => {
    try {
      const response = await axios.post(`${API_URL}/createExpense`, {
        ExpenseName: expenseData.expenseName,
        ExpenseAmount: expenseData.expenseAmount,
        category: expenseData.Category,
        user: expenseData.user,
      });
      const expense = response.data.expense;
      alert("expense has been created successfully");
      return expense;
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to create expense. Please try again.");
      throw new Error(error);
    }
  }
);
export const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expense.push(action.payload);
    },
    setExpenseId: (state, action) => {
      state.selectedExpenseId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateExpense.fulfilled, (state, action) => {
      const updatedExpense = action.payload;
      const index = state.expense.findIndex(
        (exp) => exp._id === updatedExpense._id
      );
      if (index !== -1) {
        state.expense[index] = updatedExpense;
      }
    })
    .addCase(deleteExpense.fulfilled, (state, action) => {
        const deletedExpenseId = action.payload;
        state.expense = state.expense.filter(
          (expense) => expense._id !== deletedExpenseId
        );
      });
  },
});

export const { addExpense, setExpenseId } = expenseSlice.actions;
export default expenseSlice.reducer;
