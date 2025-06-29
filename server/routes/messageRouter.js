import express from 'express'
import { jwtMiddleware } from '../middlewares/jwt.js'
import { getMessages, getUserForSidebar, markMessageAsSeen, sentMessage } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get('/users', jwtMiddleware, getUserForSidebar);
messageRouter.get("/:id", jwtMiddleware, getMessages);
messageRouter.put("/mark/:id", jwtMiddleware, markMessageAsSeen); 
messageRouter.post('/send/:id', jwtMiddleware, sentMessage);

export default messageRouter