import express from 'express';
import { register, login, isAuth, logout } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();
userRouter.post('/register', register); // Route for user registration
userRouter.post('/login', login); // Route for user login
userRouter.get('/is-auth', authUser, isAuth); // Route for user authentication (authUser is a middleware)
userRouter.get('/logout', authUser, logout); // Route for user logout

export default userRouter;
