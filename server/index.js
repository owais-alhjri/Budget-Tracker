import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import BudgetModel from "./Models/BudgetModel.js";
import bcrypt from "bcrypt";
import ExpenseModel from './Models/ExpenseModel.js';
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cors());

const connectString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(connectString)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));
const storage = multer.diskStorage({
    destination:(req,file,cd) =>{
        cd(null,"uploads/");
    },
    filename:(req, file,cd)=>{
        cd(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({storage:storage});

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

app.use("/uploads", express.static(__dirname + "/uploads"));
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
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
            profilePic: 'user.png',
        });
        await user.save();
        res.send({user:user,msg:"Added."});

    }catch(error){
        res.status(500).json({error:"An error occurred"});
    }});

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
    
        // Check if the user exists
        const user = await UserModel.findOne({ email: email });
        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }
    
        // Validate the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ msg: "Authentication failed" });
        }
    
        // If authentication is successful, return the user
        res.status(200).json({ user, msg: "Success" });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "An error occurred during login." });
      }
    });

    app.post('/logout', async (req, res) => {
      res.status(200).json({ msg: "Logged out successfully" });
    });

app.get('/userList', async (req, res)=>{
    try{
        const usersList = await UserModel.find();
        res.status(200).json(usersList);
    }catch(error){
        res.status(500).json({error:"An error occurred while fetching users"});
        
    }
});

app.get('/categoryList', async(req, res) => {
  try {
    const { user } = req.query;
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const categoryList = await BudgetModel.find({user})
      .populate("user", "name email");
    res.status(200).json(categoryList);
  } catch(error) {
    console.error("Error fetching category list:", error);
    res.status(500).json({error: "An error occurred while fetching Category"});
  }
});
app.get('/expenseList', async (req, res) => {
  try {
    const { user } = req.query;
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const expenseList = await ExpenseModel.find({ user })
      .populate({ path: "category", select: "budgetName" }) // Populate the category field
      .populate("user", "name email");
    res.status(200).json(expenseList);
  } catch (error) {
    console.error("Error fetching expense list:", error);
    res.status(500).json({ error: "An error occurred while fetching expenses." });
  }
});

app.post('/createBudget', async(req, res)=>{
    try{
        const {budgetName,Amount,user,color} = req.body;

        if(!mongoose.Types.ObjectId.isValid(user)){
            return res.status(400).json({error:"Invalid user Id"});
        }
        const budget = new BudgetModel({
            budgetName,
            Amount,
            user,
            color,
        });

        await budget.save();
        res.send({budget:budget,msg:"Added."})
    }catch(error){
        res.status(500).json({error:"An error occurred"});
    }

});


app.post('/createExpense', async (req, res) => {
    try{    

        const {ExpenseName, ExpenseAmount, category,categoryName, user} = req.body;
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
            categoryName,
            user,
        });
        await expense.save();
        res.send({expense:expense,msg:"Added"});
    }catch(error){
        res.status(500).json({error:"An error occurred"});

    }
});

app.put('/EditExpense/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { ExpenseName, ExpenseAmount, category } = req.body;

    if (!ExpenseName || !ExpenseAmount || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const UpdateExpense = await ExpenseModel.findById(id);
    if (!UpdateExpense) {
      return res.status(404).json({ error: "Expense ID not found" });
    }

    UpdateExpense.ExpenseName = ExpenseName;
    UpdateExpense.ExpenseAmount = ExpenseAmount;
    UpdateExpense.category = category;

    await UpdateExpense.save();
    res.status(200).json({ msg: "Expense updated successfully", expense: UpdateExpense });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: error.message });
  }
});
app.put(
  "/updateUserProfile/:email/",
  upload.single("profilePic"),
  async (req, res) => {
    const email = req.params.email;
    const name = req.body.name;
    const password = req.body.password;

    try {
      const userToUpdate = await UserModel.findOne({ email: email });

      if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update name
      userToUpdate.name = name;

      // Handle profile picture update
      if (req.file) {
        // A new profile picture was uploaded
        const profilePic = req.file.filename;
        
        // If there's an existing profile pic that's not the default, delete it
        if (userToUpdate.profilePic && userToUpdate.profilePic !== 'user.png') {
          const oldFilePath = path.join(
            __dirname,
            "uploads",
            userToUpdate.profilePic
          );
          
          // Try to delete the old file (don't block the operation if it fails)
          try {
            fs.unlinkSync(oldFilePath);
            console.log("Old file deleted successfully");
          } catch (err) {
            console.error("Error deleting file:", err);
            // Continue with the update even if file deletion fails
          }
        }
        
        // Set the new profile picture
        userToUpdate.profilePic = profilePic;
      }

      // Always hash the password for security
      const hashedPassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedPassword;

      // Save the updated user
      await userToUpdate.save();

      // Return the updated user data
      res.status(200).json({ 
        user: userToUpdate, 
        msg: "Profile updated successfully" 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
app.delete('/deleteExpense/:id', async(req, res)=>{
  try{
    const {id} = req.params;
    await ExpenseModel.findByIdAndDelete(id);
    res.status(200).json({message:"Expense deleted successfully"});
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).send({ error: 'Failed to delete expense' });
}
});

app.delete("/deleteBudget/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the budget exists
    const budget = await BudgetModel.findById(id);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Delete all expenses associated with this budget
    await ExpenseModel.deleteMany({ category: id });

    // Delete the budget
    await BudgetModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Budget and associated expenses deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget and expenses:", error);
    res.status(500).send({ error: "Failed to delete budget and associated expenses" });
  }
});

app.listen(3001, () =>{
    console.log("You are connected");
})