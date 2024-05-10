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
                _id: item.id,
                last_name: item.last_name
            }
        })
        response.status(200).send(res);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const users = await User.find({
            _id: id
        });
        response.status(200).send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;