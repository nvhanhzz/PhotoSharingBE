const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.get("/photosOfUser/:id", async (request, response) => {
    try {
        const userId = request.params.id;
        const photos = await Photo.find({ user_id: userId });

        if (!photos) {
            return response.json({ message: "Photos not found" });
        }

        const updatedPhotos = await Promise.all(photos.map(async (photo) => {
            const updatedComments = await Promise.all(photo.comments.map(async (cmt) => {
                const UID = cmt.user_id;
                const user = await User.findById(UID);
                return {
                    comment: cmt.comment,
                    date_time: cmt.date_time,
                    user: {
                        _id: user._id,
                        last_name: user.last_name
                    }
                };
            }));

            return {
                _id: photo._id,
                file_name: photo.file_name,
                date_time: photo.date_time,
                user_id: photo.user_id,
                comments: updatedComments
            };
        }));

        response.status(200).json(updatedPhotos);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;