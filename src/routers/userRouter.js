import express from "express";
import {
  finishGithubLogin,
  getChangePassword,
  getEdit,
  logout,
  postChangePassword,
  postEdit,
  see,
  startGithubLogin,
} from "../controllers/userController";
import {
  avatarFiles,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middleware";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarFiles.single("avatar"), postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;
