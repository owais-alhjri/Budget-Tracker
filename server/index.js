import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import BudgetModel from "./Models/BudgetModel.js";
import bcrypt from "bcrypt";
import ExpenseModel from './Models/ExpenseModel.js';

const app = express();
app.use(express.json());
app.use(cors());

const connectString = "mongodb+srv://owais:owais@users.lqkcx1u.mongodb.net/?retryWrites=true&w=majority&appName=users";

mongoose.connect(connectString)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
    
app.post("/registerUser", async (req, res)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new UserModel({
            name:name,
            email:email,
            password:hashedPassword,
        });
        await user.save();
        res.send({user:user,msg:"Added."});

    }catch(error){
        res.status(500).json({error:"An error occurred"});
    }});

app.post('/login', async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await UserModel.findOne({email:email});
        if(!user){
            return res.status(500).json({msg:"User not found"});
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!password){
            return res.status(500).json({msg:"Authentication failed"})
        }
        res.status(200).json({user,msg:"Success"})
    }catch(error){
        res.status(500).json({error:error.msg});
    }});

app.post('/logout', async(req, res)=>{
   res.status(200).json({msg:"Logged out successfully"});
});

app.get('/userList', async (req, res)=>{
    try{
        const usersList = await UserModel.find();
        res.status(200).json(usersList);
    }catch(error){
        res.status(500).json({error:"An error occurred while fetching users"});
        
    }
});

app.get('/categoryList', async(req, res)=>{
    try{
        const { user } = req.query;
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const categoryList = await BudgetModel.find({user})
        .populate("user","name email");
        res.status(200).json(categoryList);
    }catch(error){
        console.error("Error fetching category list:", error);
        res.status(500).json({error:"AN error occurred while fetching Category"});

    }
});

app.post('/createBudget', async(req, res)=>{
    try{
        const {budgetName,Amount,user} = req.body;

        if(!mongoose.Types.ObjectId.isValid(user)){
            return res.status(400).json({error:"Invalid user Id"});
        }
        const budget = new BudgetModel({
            budgetName,
            Amount,
            user,
        });

        await budget.save();
        res.send({budget:budget,msg:"Added."})
    }catch(error){
        res.status(500).json({error:"An error occurred"});
    }

});


app.post('/createExpense', async (req, res) => {
    try{    

        const {ExpenseName, ExpenseAmount, category, user} = req.body;
        if(!mongoose.Types.ObjectId.isValid(category)){
            return res.status(400).json({error:"Invalid category"});
        }
        if(!mongoose.Types.ObjectId.isValid(user)){
            return res.status(400).json({error:"Invalid user Id"});
        }
        const expense = new ExpenseModel({
            ExpenseName,
            ExpenseAmount,
            category,
            user,
        });
        await expense.save();
        res.send({expense:expense,msg:"Added"});
    }catch(error){
        res.status(500).json({error:"An error occurred"});

    }
});

app.listen(3001, () =>{
    console.log("You are connected");
})