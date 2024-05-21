import {
  createTask,
  updateTask,
  deleteTask,
  getMyTask,
  getSinlgeTask,
} from "../controller/taskController.js";
import {isAuthenticated} from '../middleware/auth.js'
import express from "express";
const router = express.Router();
router.post("/create", isAuthenticated,createTask);
router.get("/getall", isAuthenticated, getMyTask);
router.get("/getsinlge/:id", isAuthenticated, getSinlgeTask);
router.delete("/delete/:id", isAuthenticated, deleteTask);
router.put("/update/:id", isAuthenticated, updateTask);
export default router;
