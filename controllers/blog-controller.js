import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import User from '../models/User.js';


export const getAllBlogs=async (req,res,next)=>{
    let blogs;
    try{
        blogs= await Blog.find()
    }catch(error){
        console.log(error,'error get All blogs');
    }
    if(!blogs){
        return res.status(404).json({message:"No blogs found"})
    }
    return res.status(200).json({blogs})
}

export const addBlog=async (req,res,next)=>{
    const {title,description,image,user}=req.body;
    //on le fait apres les ref
    let existingUser
     try{
     existingUser= await User.findById({user})
     }catch(error){
       return  console.log(error);
     }
     if(!existingUser){
         return res.status(400).json({message:"Unable to find user by this id"})
     }
 
    
    const blog= new Blog({
     title,description,image,user
    })
 
    try{
     //save new blog in database as document
    //  await blog.save();
    //apres ref 
    //Cette ligne crée une nouvelle session MongoDB en utilisant la méthode startSession
    // de Mongoose. Une session MongoDB est une séquence
    // d'opérations liées qui peuvent être soumises en une seule transaction
    const session= await mongoose.startSession();
    session.startTransaction();
    await blog.save({session})
    existingUser.blogs.push(blog)
    await existingUser.save({session})
    await session.commitTransaction()
    }catch(error){
      console.log(error);
      return res.status(500).json({message:error})
    }
    //201 created
    return res.status(201).json({blog})
 }

 export const updateBlog=async (req,res,next)=>{
    const {title,description}=req.body;
   const blogId=req.params.id
    let blog
 
    try{

     blog= await Blog.findByIdAndUpdate(blogId,{title,description})
    }catch(error){
     return console.log(error);
    }

    if (!blog){
        return res.status(500).json({message:'unable to update the blog'});
    }
    return res.status(200).json({blog})
 }

 export const getBlogById=async (req,res,next)=>{
    const {title,description}=req.body;
   const id=req.params.id
    let blog
 
    try{

     blog= await Blog.findById(id)
    }catch(error){
     return console.log(error);
    }

    if (!blog){
        return res.status(404).json({message:'no blog found'});
    }
    return res.status(200).json({blog})
 }

 export const deleteBlog=async (req,res,next)=>{
    const {title,description}=req.body;
   const id=req.params.id
    let blog
 
    try{

    //  blog= await Blog.findByIdAndDelete(id)
     //apres ref
     blog= await Blog.findByIdAndDelete(id).populate('user')
     //supprimer les blog d'un user
     await blog.user.blogs.pull(blog)
     await blog.user.save()
    }catch(error){
     return console.log(error);
    }

    if (!blog){
        return res.status(400).json({message:'enable to delete blog'});
    }
    return res.status(200).json({message:'blog deleted successfully'})
 }

 export const getByUserId= async (req,res,next)=>{
    const userId=req.params.id;
    let userBlogs;
    try{
        userBlogs= await User.findById({userId}).populate('blogs')
        }catch(error){
          return  console.log(error);
        }
        if(!userBlogs){
            return res.status(404).json({message:"No blog found"})
        }
 }
