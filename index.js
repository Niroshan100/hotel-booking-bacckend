import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/usersRoute.js";
import mongoose from "mongoose";
import galleryItemRouter from "./routes/galleryItemRoute.js";
import jwt from "jsonwebtoken";
const app = express();

app.use(bodyParser.json());

const connectionString =
  "mongodb+srv://niroshana:1234@cluster0.za7mw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, "secret", (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use("/api/users", userRouter);
app.use("/api/gallery", galleryItemRouter);

app.listen(3002, (req, res) => {
  console.log("Sever is running on on port 3002");
});
