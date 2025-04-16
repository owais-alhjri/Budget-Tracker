import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import { budgetSlice } from "../Features/BudgetSlice";

export const Store = configureStore({
    reducer:{
        users:usersReducer,
        budgets: budgetSlice.reducer, 
    },
});