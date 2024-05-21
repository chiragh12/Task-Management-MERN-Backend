import mongoose from "mongoose";
const taskSchema = mongoose.Schema ({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    status : {
        type : String,
        enum : ['completed', 'incomplete'],
        default : "incomplete"
    },
    archieved : {
        type : Boolean,
        default: false
    },
    createdBy : {
        type : mongoose.Schema.ObjectId,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
    }
})
export const Task = mongoose.model("Task", taskSchema)