const express = require("express");
const noteRouter = express.Router();
const dotenv = require('dotenv');

const { noteModel } = require("../models/note.model");
const { userModel } = require("../models/user.model");


const { authenticate } = require("../middleware/authenticate");

dotenv.config();

noteRouter.get("/", authenticate, async (req, res) => {
    const { email } = req.body;
    console.log(email);
    const user = await userModel.findOne({ email });
    let { _id: user_id } = user;
    let allNotes = await noteModel.find({ user_id });
    res.send(allNotes);
})

noteRouter.post("/create", authenticate, async (req, res) => {
    console.log(req.body);
    const { title, detail, email } = req.body;
    if (!title || !detail || !email) {
        return res.status(400).send({ message: "incomplete note format" });
    }
    let user = await userModel.findOne({ email: email })

    let x = {
        title: title,
        detail: detail,
        user_id: user["_id"]
    }
    let newnote = new noteModel(x)
    await newnote.save();
    return res.status(200).send(x);
})

noteRouter.delete("/delete/:id", authenticate, async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    await noteModel.deleteOne({ id })
    return res.status(200).send({ message: "deleted" });
})

module.exports = { noteRouter };