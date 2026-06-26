// External Modules
const express = require("express");
const mongoose = require("mongoose");

const PORT = 3001;
const MONGO_URI =
  "mongodb+srv://preetamchinde_db_user:preetamchinde_db_user@cluster0.qla0c5z.mongodb.net/airbnb?appName=Cluster0";

// Internal Modules
const storeRouter = require("./routers/storeRouter");
const adminRouter = require("./routers/adminRouter");

// App
const app = express();

// Configuration
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.urlencoded({ extended: true }));

// Routes
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
