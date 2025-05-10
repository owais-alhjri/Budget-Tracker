import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import { budgetSlice } from "../Features/BudgetSlice";
import { expenseSlice } from "../Features/ExpenseSlice";

export const Store = configureStore({
    reducer:{
        users:usersReducer,
        budgets: budgetSlice.reducer, 
        expenses:expenseSlice.reducer,
    },
});