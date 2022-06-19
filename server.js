const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8080;
const { connectDB, User, Todo } = require("./config/dbConn");
const cors = require("cors");
require("dotenv").config();

connectDB();

const whitelist = ["http://localhost:3000"];
const corsOptions = {
    origin: (origin, callback) => {
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

// login auth
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

//signup auth
app.post("/signup", async (req, res) => {
    try {
        // console.log(req.body);
        const { name, mail, company, url, pass } = req.body;
        const checkMail = await User.find({ mail });
        // console.log("checkMail: ", checkMail);
        if (checkMail.length !== 0) {
            res.status(200).json({ message: "Mail already registered!" });
        } else {
            const newUser = await User.create({
                name,
                mail,
                company,
                url,
                pass,
            });
            newUser.save();
            res.status(200).json({ message: "User registered!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Adding new todo
app.post("/todo", async (req, res) => {
    try {
        const { date, title, todos } = req.body;
        const newTodo = await Todo.create({
            date,
            title,
            todos,
        });
        newTodo.save();
        res.status(200).json({ message: "Todo Added" });
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
});

// app.post("/todo/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const s = await Todo.find(
//             {},
//             {
//                 todos: {
//                     $elemMatch: {
//                         _id: id,
//                     },
//                 },
//             }
//         );
//         console.log(s);
//     } catch (error) {
//         res.status(200).json({ message: error.message });
//     }
// });

//Getting all todos
app.get("/todo", async (req, res) => {
    try {
        let data = await Todo.find();
        res.status(200).json({ data, message: "Data Fetched Successfully" });
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
});

//connecting to MongoDB and starting Server
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
