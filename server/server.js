import express from "express";
// import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";
dotenv.config();

const app = express();

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.SECRET,
//   baseURL: process.env.BASE_URL,
//   clientID: process.env.CLIENT_ID,
//   issuerBaseURL: process.env.ISSUER_BASE_URL,
// };

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());

// app.use(auth(config));

// function to check if the user exist in the db
const enusureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({auth0Id: user.sub});

    if(!existingUser){
      const newUser = new User({   
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
        role: "jobseeker",
        profilePicture: user.picture,
      });
      
      await newUser.save();
      console.log("User added to db", user);
    } else{
      console.log("User already exist in db", existingUser);
    }
  } catch (error) {
    console.log("Error Checking or Adding user to db", error.message);
  }
});

app.get("/", async (req, res) => {
  res.json({ message: "Server is running" });
});

// routes
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file)=>{
  import(`./routes/${file}`)
  .then((route) => {
    app.use("/api/v1/", route.default);
  }).catch((error) => {
    console.log("Error Importing route", error);
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to Database!", error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});