const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.post("/new", async (req, res) => {
    try {
        const photoId = req.body.photoId;
        const commentContent = req.body.comment;
        const user = await User.findOne({
            email: req.decodedJWT.email
        });

        const newComment = {
            comment: commentContent,
            date_time: Date.now(),
            user_id: user._id
        }

        Photo.updateOne({ _id: photoId }, { $push: { comments: newComment } })
            .then(result => {
                return res.status(200).json({ "result": result });
            })
            .catch(err => {
                console.error("Lỗi khi cập nhật ảnh:", err);
                return res.status(400).json({ "error": err });
            });


    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

module.exports = router;