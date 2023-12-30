import express from "express";
import { edit, watch } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/videos", watch);
videoRouter.get("/edit", edit);

export default videoRouter;
