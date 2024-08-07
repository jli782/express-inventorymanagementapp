const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();
const mongodbURL = process.env.DATABASE_URL || process.env.MONGODB_URL; // prod OR dev db

// mongodb connection setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
run().catch((err) => console.log(err));

async function run() {
  try {
    await mongoose.connect(mongodbURL);
  } catch (err) {
    throw new Error(
      `Something went wrong while attempting to connect to mongoDB.`
    );
  }
}

// compression middleware
const compression = require("compression");

// helmet middleware for common vulnerabilities
const helmet = require("helmet");

// express-rate-limit
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
});

// routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const shopwikiRouter = require("./routes/shopwiki");

const app = express();

app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": [
        "'self'",
        "code.jquery.com",
        "cdnjs.cloudflare.com",
        "unpkg.com",
        "'unsafe-hashes'",
        "'nonce-rAnd0m'",
        "self blob: ",
      ],
      "img-src": [
        "'self'",
        "cfw.sarna.net",
        "res.cloudinary.com",
        "self blob: data:",
      ],
    },
  })
);
app.use(limiter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/shopwiki", shopwikiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Error" });
});

module.exports = app;
