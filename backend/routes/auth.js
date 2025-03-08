import { Router } from "express";
import { login, logout } from "../controllers/auth.js";
import { signup } from "../controllers/auth.js";
import { checkToken } from "../middlewares/auth.js";

const authRoute = Router();

//authentication
authRoute.post('/login',login);
authRoute.post('/logout',logout);
authRoute.post('/singup',signup);
authRoute.get('/checkToken',checkToken);

export default authRoute