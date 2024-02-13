const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

// To get user profile
router.get("/user/:id", async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.params.id }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await POST.find({ postedBy: req.params.id }).populate("postedBy", "_id");

        res.status(200).json({ user, posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// To follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        // Update the user being followed
        const followedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        // Update the current user with the followed user
        const currentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        res.json({ followedUser, currentUser });
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// To unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        // Unfollow the user in the USER collection
        const unfollowedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        // Remove the user from the 'following' list of the current user
        const currentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        res.json(currentUser);
    } catch (err) {
        res.status(422).json({ error: err.message || "Something went wrong" });
    }
});

// To upload profile pic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        // Validate request body
        if (!req.body.pic) {
            return res.status(400).json({ error: "Missing 'pic' field in the request body" });
        }
        // Update profile picture
        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $set: { Photo: req.body.pic } },
            { new: true }
        );
        // Respond with the updated user data
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;