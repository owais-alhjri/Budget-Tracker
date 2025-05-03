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
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"userInfo",
        required:true,
    },
    color:{
        type:String,
        default:"#000",
    }

});

const BudgetModel = mongoose.model("BudgetInfo",BudgetSchema);
export default BudgetModel;