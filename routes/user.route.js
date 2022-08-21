const express = require("express");
const userRouter = express.Router();
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const { userModel } = require("../models/user.model");

userRouter.post("/register", async (req, res) => {
    let { email, password, age } = req.body;
    if (!email || !password || !age) {
        return res.status(400).send({ message: "error, insuffucient data" })
    }
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            return res.status(400).send({ message: "couldnot register try again" });
        } else {
            const newuser = new userModel({
                email: email,
                password: hash,
                age: age
            })
            try {
                await newuser.save();
                return res.status(200).send({ message: "registered", email, age })
            } catch (err) {
                return res.status(400).send({ message: "failed try registering again!!" });
            }
        }
    });
})

userRouter.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).send({ message: "invalid creds" });
    }
    let { password: hash, age, _id } = user
    bcrypt.compare(password, hash, async (err, result) => {
        if (err || !result) {
            return res.status(400).send({ message: "invalid creds" });
        }
        var token = await jwt.sign({
            email: email,
            age: age,
            _id: _id
        }, process.env.SECRET_KEY);
        res.status(200).send({ message: "login successfull", token: token });
    });
})

module.exports = { userRouter };