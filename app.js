import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnection from "./dataBase/db.js";
import fileupload from "express-fileupload";
import { errorMiddleware } from "./middleware/error.js";
import userRoute from "./routes/userRoute.js";
import taskRoute from "./routes/taskRoute.js";
const app = express();
dotenv.config({ path: "./config/config.env" });
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/task", taskRoute);
dbConnection();
app.use(errorMiddleware);
export default app;
