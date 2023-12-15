import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getAllUsers=async (req,res,next)=>{
    let users;
    try{
        users= await User.find()
    }catch(error){
        console.log(error,'error get All users');
    }
    if(!users){
        return res.status(404).json({message:"No users found"})
    }
    return res.status(200).json({users})
}
//create user signup
export const signUp=async (req,res,next)=>{
   const {name,email,password}=req.body;
   let existingUser
    try{
    existingUser= await User.findOne({email})
    }catch(error){
      return  console.log(error);
    }
    if(existingUser){
        return res.status(400).json({message:"User already exist"})
    }
//haspassword permet d'incrypter le password et le rendre plus securise
    const hashedPassword=bcrypt.hashSync(password)
   const user= new User({
    name,
    email,
    password:hashedPassword,
    blogs:[]
   })

   try{
    //save new user in database as document
    await user.save();
   }catch(error){
    return console.log(error);
   }
   //201 created
   return res.status(201).json({user})
}

//login

export const signIn=async(req,res,next)=>{
    const {email,password}=req.body;
    let existingUser;
    try{
    existingUser= await User.findOne({email})
    
    }catch(error){
      return  console.log(error);
    }
    if(!existingUser){
        return res.status(404).json({message:"Could not find user with this email"})
    }

    const isPasswordCorrect=bcrypt.compareSync(password,existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect password"})
    }

    return res.status(200).json({message:"login successfull"})
}