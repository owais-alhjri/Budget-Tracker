import mongoose from "mongoose";

const ExpenseSchema = mongoose.Schema({
    ExpenseName:{
        type:String,
        required:true,
    },
    ExpenseAmount:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'BudgetInfo',
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userInfo",
        required:true,
    },

    
});

const ExpenseModel = mongoose.model("ExpenseInfo",ExpenseSchema);
export default ExpenseModel;