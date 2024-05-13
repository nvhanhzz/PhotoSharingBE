const express = require("express");
const jwt = require('jsonwebtoken');

const User = require("../db/userModel");
const router = express.Router();
const { hashPassword, comparePassword } = require('../config/HashPassword');

router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "Login fail" });
        }
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Login fail" });
        }

        const payload = { email: email }
        const token = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_exp });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000
        });

        return res.status(200).json({ message: "Login success" });

    } catch (error) {
        // console.error("Error:", error);
        res.status(500).json({ message: "Login error!" });
    }
});

router.post("/logout", async (req, res) => {
    try {
        // console.log("logout");
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout success" });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "Login error!" });
    }
});

router.post("/register", async (req, res) => {
    try {
        const email = req.body.email.trim();
        const password = req.body.password.trim();
        const firstname = req.body.firstname.trim();
        const lastname = req.body.lastname.trim();
        const location = req.body.location.trim();
        const occupation = req.body.occupation.trim();
        const description = req.body.description.trim();

        const existingUser = await User.findOne({ email });

        if (email === '') {
            return res.status(400).json({ message: "Email cannot be blank" });
        } else if (password === '') {
            return res.status(400).json({ message: "Password cannot be blank" });
        } else if (firstname === '') {
            return res.status(400).json({ message: "First name cannot be blank" });
        } else if (lastname === '') {
            return res.status(400).json({ message: "Last name cannot be blank" });
        }

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = new User({
            first_name: firstname,
            last_name: lastname,
            location: location,
            occupation: occupation,
            description: description,
            email: email,
            password: await hashPassword(password)
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        // console.error("Error:", error);
        res.status(500).json({ message: "Registration error!" });
    }
});

module.exports = router;