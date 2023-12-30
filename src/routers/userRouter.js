import express from "express";
import { edit, remove } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/users", edit);
userRouter.get("/remove", remove);

export default userRouter;
