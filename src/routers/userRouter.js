import express from "express";
import {
  edit,
  logout,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/users", edit);
userRouter.get("/:id(\\d+)", see);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
