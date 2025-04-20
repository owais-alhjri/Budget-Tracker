import mongoose from "mongoose";

const ExpenseSchema = mongoose.Schema({
    ExpenseName:{
        type:String,
        required:true,
    },
    ExpenseAmount:{
        type:Number,
        required:true,
        default: 0,
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
 
    
},
   {
        timestamps: {
          createdAt: true,
          updatedAt: false, // Set to false to disable updatedAt
        },
      }
);

const ExpenseModel = mongoose.model("ExpenseInfo",ExpenseSchema);
export default ExpenseModel;