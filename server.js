const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const path = require("path");
dotenv.config({ path: "./config/config.env" });

connectDB();

// Route files

const auth = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");

const app = express();

//Parse JSON
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// const corsOptions = {
//   origin: "https://bookstagram7.cyclic.app/",
//   credentials: true,
//   optionSuccessStatus: 200,
// };

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors({ origin: "*" }));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));

//Mount Routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/posts", posts);

app.use(errorHandler);

const PORT = process.env.PORT || 5005;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
