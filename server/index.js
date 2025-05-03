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

const app = express();
app.use(express.json());
app.use(cors());

const connectString = "mongodb+srv://owais:owais@users.lqkcx1u.mongodb.net/?retryWrites=true&w=majority&appName=users";

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
app.get('/expenseList', async (req, res) => {
    try {
      const { user } = req.query;
  
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
  
      // Fetch expenses and populate the category field to include budgetName
      const expenseList = await ExpenseModel.find({ user })
        .populate({
          path: "category", // Populate the category field
          select: "budgetName", // Only fetch the budgetName field
        })
        .populate("user", "name email"); // Optionally populate user details
  
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
      let profilePic = null;
      if (req.file) {
        profilePic = req.file.filename; 
        if (userToUpdate.profilePic) {
          const oldFilePath = path.join(
            __dirname,
            "uploads",
            userToUpdate.profilePic
          );
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("Old file deleted successfully");
            }
          });
          userToUpdate.profilePic = profilePic; 
        }
      } else {
        console.log("No file uploaded");
      }

      userToUpdate.name = name;

      if (password !== userToUpdate.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedPassword;
      } else {
        userToUpdate.password = password; 
      }

      await userToUpdate.save();

      res.send({ user: userToUpdate, msg: "Updated." });
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

app.listen(3001, () =>{
    console.log("You are connected");
})