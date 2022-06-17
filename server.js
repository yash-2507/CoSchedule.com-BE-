const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8080;
const { connectDB, User } = require("./config/dbConn");
const cors = require("cors");
require("dotenv").config();

connectDB();

const whitelist = ["http://localhost:8080"];
const corsOptions = {
    origin: (origin, callback) => {
        // console.log(origin);
        if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/login", async (req, res) => {
    let match = [];
    try {
        const { mail, pass } = req.body;
        match = await User.find({
            mail: mail,
            pass: pass,
        });
        if (match.length) {
            res.status(200).json({ match, message: "User Found" });
        } else {
            res.status(200).send({ message: "User Not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.messge });
    }
});

app.post("/signup", async (req, res) => {
    try {
        // console.log(req.body);
        const { name, mail, company, url, pass } = req.body;
        const newUser = await User.create({
            name,
            mail,
            company,
            url,
            pass,
        });
        newUser.save();
        res.status(200).json({ message: "User registered!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        try {
            console.log(`Server started at PORT ${PORT}`);
        } catch (error) {
            console.log(error.message);
        }
    });
});
