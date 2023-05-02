const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { clientRedis } = require("../helpers/redis");
require("dotenv").config()


const register = async(req,res)=>{
    try {
       const {name,email,password} = req.body;
       if(!name || !email || !password){
        return res.status(400).send({msg:"All details are required"});
       } 
       const userPresent = await UserModel.findOne({email});
       if(userPresent){
        return res.status(400).send({msg:"Already registered, please login"});
       }
       const hash = bcrypt.hashSync(password,5);
       const newUser = new UserModel({email,password:hash,name});
       await newUser.save();
       res.status(201).send({msg:"User registered successfully"}) 
    } catch (error) {
        res.status(500).send({msg:error.message})
    }
}


const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).send({msg:"No user found, please register"});
        }
        const passwordValid = bcrypt.compareSync(password,user.password);
        if(!passwordValid){
            return res.status(400).send({msg:"Invalid credentials"});
        }
        const token = jwt.sign({email},process.env.token_key);
         await clientRedis.set("token",token);
         return res.status(200).send({msg:"Login Successful"});

    } catch (error) {
        res.status(500).send({msg:error.message})
    }
}



const logout = async(req,res)=>{
    try {
        let token = ""
        await clientRedis.get("token",(err,result)=>{
           if(err){
            return res.status(400).send({msg:err.message});
           }
           else{
            token = result
           }
        })
        await clientRedis.lpush("blacklisted",token);
          res.status(200).send({msg:"Logout successful"})
    } catch (error) {
        res.status(500).send({msg:error.message})
    }
}




module.exports = {register,login,logout}