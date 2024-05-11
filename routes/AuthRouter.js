const express = require("express");
const jwt = require('jsonwebtoken');

const User = require("../db/userModel");
const router = express.Router();
const { hashPassword, comparePassword } = require('../middleware/HashPassword');

router.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.json({ message: "Login fail" });
        }
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.json({ message: "Login fail" });
        }

        const payload = { username: username }
        const token = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_exp });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000
        });

        console.log(token);

        return res.status(200).json({ message: "Login success" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Login error!" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        console.log("logout");
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout success" });
    } catch (error) {
        console.log(error);
    }
})

router.post("/register", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const location = req.body.location;
        const occupation = req.body.occupation;

        const existingUser = await User.findOne({ username });

        if (username === '') {
            return res.json({ message: "Username cannot be blank" });
        } else if (password === '') {
            return res.json({ message: "Password cannot be blank" });
        } else if (firstname === '') {
            return res.json({ message: "First name cannot be blank" });
        } else if (lastname === '') {
            return res.json({ message: "Last name cannot be blank" });
        }

        if (existingUser) {
            return res.json({ message: "Username already exists" });
        }

        const newUser = new User({
            first_name: firstname,
            last_name: lastname,
            location: location,
            occupation: occupation,
            username: username,
            password: await hashPassword(password)
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Registration error!" });
    }
});

module.exports = router;