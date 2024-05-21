import mongoose from "mongoose";
const dbConnection = () => {
  mongoose
    .connect(process.env.MONO_URI, {
      dbName: "Task_managment_app",
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch(err => {
      console.log(err);
    });
};
export default dbConnection;
