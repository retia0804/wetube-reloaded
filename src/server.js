import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

// ==========================================================
// Middleware : logger

const logger = morgan("dev");
app.use(logger);

// ==========================================================
// POST : Body

app.use(express.urlencoded({ extended: true }));

// ==========================================================
// Router

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
