const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/authDB", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
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
const User = model("user", signUpUserSchema);
module.exports = { connectDB, signUpUserSchema, User };
