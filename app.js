import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user-routes.js'
import blogRouter from './routes/blog-routes.js';

const app=express()
//on l'ajoute lorsqu'on fait le post and 
app.use(express.json())
app.use('/api/users',userRouter)
app.use('/api/blogs',blogRouter)

mongoose
.connect('mongodb+srv://samia:admin@admin.utqqdu2.mongodb.net/?retryWrites=true&w=majority'
).then(()=>app.listen(5000)
).then(()=>console.log('connexion a mongodb et ecoute du port 5000')
).catch((error)=>console.log(error))
