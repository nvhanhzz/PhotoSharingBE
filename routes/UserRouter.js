const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.get("/list", async (request, response) => {
    try {
        const users = await User.find({});
        const res = users.map(item => {
            return {
                _id: item._id,
                first_name: item.first_name,
                last_name: item.last_name
            }
        })
        response.status(200).send(res);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/jwt", async (request, response) => {
    try {
        if ("decodedJWT" in request) {
            const user = await User.findOne({
                email: request.decodedJWT.email
            });
            response.status(200).send({
                _id: user._id,
                first_name: user.first_name
            });
        } else {
            response.status(200).json({ message: "No token but no error" })
        }
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const user = await User.findOne({
            _id: id
        });
        response.status(200).send({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            location: user.location,
            occupation: user.occupation,
            description: user.description
        });
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;