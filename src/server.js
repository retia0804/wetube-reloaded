import "dotenv/config";
import express from "express";
import session from "express-session";
import morgan from "morgan";

import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware";
import rootRouter from "./routers/rootRouter";
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
// Session

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

// ==========================================================
// Middleware

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));

// ==========================================================
// Router

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
