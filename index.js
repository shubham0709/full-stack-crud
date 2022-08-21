const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors')

const { connection } = require("./config/connection");
const { userModel } = require("./models/user.model");
const { userRouter } = require("./routes/user.route");
const { noteRouter } = require("./routes/note.route");

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/users", async (req, res) => {
    let data = await userModel.find();
    res.send(data);
})

app.get("/", (req, res) => {
    res.send("home page");
})

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log('databse connected');
    } catch (err) {
        console.log("could not connect database");
    }
    console.log("server started on port " + process.env.PORT);
})