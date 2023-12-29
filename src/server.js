import express from "express";

const PORT = 4000;
const app = express();

// ==========================================================

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  next();
};

app.use(logger);
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
