import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors());

const connectString = "mongodb+srv://owais:owais@users.lqkcx1u.mongodb.net/?retryWrites=true&w=majority&appName=users";

mongoose.connect(connectString,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
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
})
app.listen(3001, () =>{
    console.log("You are connected");
})