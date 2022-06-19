const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URI);
    } catch (error) {
        console.error(error);
    }
};

const signUpUserSchema = new Schema({
    name: String,
    mail: String,
    company: String,
    url: String,
    pass: {
        type: String,
        min: 8,
    },
});

const todoSchema = new Schema({
    date: Date,
    title: String,
    todos: [
        {
            todo: String,
            status: Boolean,
        },
    ],
    completed: Number,
});

const Todo = model("todo", todoSchema);
const User = model("user", signUpUserSchema);

module.exports = { connectDB, signUpUserSchema, todoSchema, User, Todo };
