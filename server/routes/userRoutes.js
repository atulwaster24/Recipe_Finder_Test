import { Router } from "express";
import { deleteUser, getUser, signin, signup, updateUser } from "../controller/user.controller.js";
import Authenticate from "../middlewares/Auth.middleware.js";

const userRouter = Router();


// GET Requests
userRouter.get('/profile/:userId',Authenticate, getUser);

// POST Requests
userRouter.post('/signin', signin);
userRouter.post('/signup', signup);

// PATCH Requests
userRouter.patch('/update/:info/:userId',Authenticate, updateUser);

// DELETE Request
userRouter.delete('/:userId',Authenticate, deleteUser);

export default userRouter;