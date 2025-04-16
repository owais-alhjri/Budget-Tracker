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
        type:String,
        required:true,
    },
});

const ExpenseModel = mongoose.model("ExpenseInfo",ExpenseSchema);
export default ExpenseModel;