import { Router } from "express";
import { forgotPassword, logout, resetPasswordGET, resetPasswordPOST} from "../controller/user.controller.js";
import Authenticate from "../middlewares/Auth.middleware.js";

const authRouter = Router();


// GET Requests
authRouter.get('/reset-password/:token', resetPasswordGET);
authRouter.post('/logout', Authenticate, logout);

// POST Requests
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPasswordPOST);


export default authRouter;