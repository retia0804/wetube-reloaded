import express from "express";
import morgan from "morgan";

const PORT = 4000;
const app = express();

const logger = morgan("dev");
app.use(logger);

// ==========================================================

const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");
globalRouter.get("/", handleHome);

const videoRouter = express.Router();
const handleEditUser = (req, res) => res.send("Edit User");
videoRouter.get("/", handleEditUser);

const userRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("Watch Video");
userRouter.get("/", handleWatchVideo);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// ==========================================================

// const logger = (req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// };

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  next();
};

app.use(privateMiddleware);

// ==========================================================

const HandleHome = (req, res, next) => {
  return res.send("I still love you");
};

const HandleLogin = (req, res) => {
  return res.send("Login here.");
};

const handleProtected = (req, res) => {
  return res.send("Whelcome to the private lounge.");
};

app.get("/", HandleHome);
app.get("/login", HandleLogin);
app.get("/protected", handleProtected);

// ==========================================================

const handleListening = () =>
  console.log(`✅ Server listening on port https://localhost:${PORT} 😀`);

app.listen(PORT, handleListening);
