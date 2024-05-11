const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// router.post("/", async (request, response) => {

// });

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
        const user = await User.findOne({
            username: request.decodedJWT.username
        });
        response.status(200).send({
            _id: user._id,
            first_name: user.first_name
        });
    } catch (error) {
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
            occupation: user.occupation
        });
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;