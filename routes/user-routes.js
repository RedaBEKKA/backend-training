import express from 'express';
import { getAllUsers, signIn, signUp } from '../controllers/user-controller.js';

const router=express.Router()

router.get('/',getAllUsers)
router.post('/signup',signUp)
router.post('/signin',signIn)

export default router;