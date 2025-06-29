import express from 'express'
import { jwtMiddleware } from '../middlewares/jwt.js'; 
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js'

const userRouter = new express.Router()

userRouter.post('/register', signup)
userRouter.post('/login', login)
userRouter.get("/check", jwtMiddleware, checkAuth);
userRouter.put('/update-profile', jwtMiddleware, updateProfile)


export default userRouter