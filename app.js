// External Modules
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const PORT = 3000;
const MONGO_URI =
  "mongodb+srv://preetamchinde_db_user:preetamchinde_db_user@cluster0.qla0c5z.mongodb.net/airbnb?appName=Cluster0";

// Internal Modules
const authRouter = require("./routers/authRouter");
const storeRouter = require("./routers/storeRouter");
const adminRouter = require("./routers/adminRouter");

// App
const app = express();

// Configuration
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "bnbairbnb",
    resave: false,
    saveUninitialized: false, // should be false for login-based apps
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  }),
);

// Middleware
// app.use((req, res, next) => {
//   if (!req.session.isLoggedIn) res.redirect("/login");
//   next();
// });

// Routes
app.use(authRouter);
app.use("/", storeRouter);
app.use("/admin", adminRouter);

// Static Files
app.use(express.static("public"));

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
