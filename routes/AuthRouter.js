const express = require("express");
const jwt = require('jsonwebtoken');

const User = require("../db/userModel");
const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({
            username: username,
            password: password
        });

        if (!user) {
            return res.status(400).json({ message: "Login fail" });
        }

        const data = { username: username }
        const token = jwt.sign(data, process.env.private_key, { expiresIn: '1h' });
        console.log("token:", token);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000
        });
        console.log("123");
        res.cookie("test", "abc", {
            httpOnly: true,
            maxAge: 3600000
        });

        return res.status(200).json({ message: "Login success" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Login error!" });
    }
});

module.exports = router;
