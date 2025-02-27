import { Router } from "express";
import { login } from "../controllers/auth.js";
import { signup } from "../controllers/auth.js";
import { checkToken } from "../middlewares/auth.js";

const authRoute = Router();

//authentication
authRoute.post('/login',login);
authRoute.post('/singup',signup);
authRoute.get('/checkToken',checkToken);

export default authRoute