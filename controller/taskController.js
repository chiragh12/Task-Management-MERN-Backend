import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Task } from "../models/taskSchema.js";
import ErrorHandler from "../middleware/error.js";
export const createTask = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const createdBy = req.user.id;
  const task = await Task.create({
    title,
    description,
    createdBy,
  });
  res.status(200).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

export const updateTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task not found", 400));
  }
  task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Task updated",
    task,
  });
});
export const deleteTask = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task not found", 400));
  }
  await task.deleteOne();
  res.status(200).json({
    success: true,
    message: "task deleted succesfully",
    task,
  });
});
export const getMyTask = catchAsyncError(async (req, res, next) => {
  const id = req.user.id;
  const task = await Task.find({ createdBy: id });
  
  res.status(200).json({
    success: true,
    task,
  });
});
export const getSinlgeTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return next(new ErrorHandler("Task does not exist", 400));
  }
  res.status(200).json({
    success: true,
    message: "Task found",
    task,
  });
});
