const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();
const upload = require("../config/UploadPhoto");

router.get("/photosOfUser/:id", async (request, response) => {
    try {
        const userId = request.params.id;
        const photos = await Photo.find({ user_id: userId });

        if (!photos) {
            return response.status(404).json({ message: "Photos not found" });
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
                        first_name: user.first_name,
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

router.post("/new", upload.fields([{ name: "img", maxCount: 1 }]), async (req, res) => {
    // console.log(req.files);
    try {
        const user = await User.findOne({
            email: req.decodedJWT.email
        });
        const link_img = req.files['img'][0];
        const newPhoto = new Photo({
            file_name: link_img.path,
            date_time: Date.now(),
            user_id: user._id,
            comments: []
        });

        await newPhoto.save();
        res.status(200).json({ "message": "upload successfully" });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const photoId = request.params.id;
        // console.log(photoId);
        const photo = await Photo.findOne({ _id: photoId });

        if (!photo) {
            return response.status(404).json({ message: "Photos not found" });
        }

        const updatedComments = await Promise.all(photo.comments.map(async (cmt) => {
            const UID = cmt.user_id;
            const user = await User.findById(UID);
            return {
                comment: cmt.comment,
                date_time: cmt.date_time,
                user: {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name
                }
            };
        }));

        const updatedPhoto = {
            _id: photo._id,
            file_name: photo.file_name,
            date_time: photo.date_time,
            user_id: photo.user_id,
            comments: updatedComments
        };

        response.status(200).json(updatedPhoto);
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

module.exports = router;