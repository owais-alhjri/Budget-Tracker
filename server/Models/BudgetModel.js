import mongoose from "mongoose";

const BudgetSchema = mongoose.Schema({
    budgetName:{
        type:String,
        required:true,
    },
    Amount:{
        type:Number,
        required:true,
    },

});

const BudgetModel = mongoose.model("BudgetInfo",BudgetSchema);
export default BudgetModel;