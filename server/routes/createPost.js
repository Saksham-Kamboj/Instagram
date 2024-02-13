const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const { route } = require("./auth");
const POST = mongoose.model("POST")


// Get All Posts
router.get("/allposts", requireLogin, async (req, res) => {
    let limit = req.query.limit;
    let skip = req.query.skip;
    try {
        const posts = await POST.find()
            .populate("postedBy", "_id name Photo")
            .populate("comments.postedBy", "_id name")
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort("-createdAt");

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create post
router.post("/createPost", requireLogin, async (req, res) => {
    try {
        const { body, pic } = req.body;
        if (!body || !pic) {
            return res.status(422).json({ error: "Please add all the fields" });
        }

        const post = new POST({
            body,
            photo: pic,
            postedBy: req.user._id
        });

        const result = await post.save();
        res.status(201).json({ post: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Show All Posted Posts in Profile 
router.get("/myposts", requireLogin, async (req, res) => {
    try {
        const myposts = await POST.find({ postedBy: req.user._id })
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
            .sort("-createdAt");

        res.json(myposts);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Give a posts like
router.put("/like", requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy", "_id name Photo");

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// Unlike post
router.put("/unlike", requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id }
        }, {
            new: true
        }).populate("postedBy", "_id name Photo");

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});


// Comment on post
router.put("/comment", requireLogin, async (req, res) => {
    try {
        const comment = {
            comment: req.body.text,
            postedBy: req.user._id
        };

        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        )
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name Photo")
            .exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// Api to delete post
router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
    try {
        const post = await POST.findOne({ _id: req.params.postId })
            .populate("postedBy", "_id")
            .exec();

        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await post.deleteOne();
            return res.json({ message: "Successfully deleted" });
        } else {
            return res.status(401).json({ error: "Unauthorized user" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// to show following post
router.get("/myfollwingpost", requireLogin, (req, res) => {
    POST.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => { console.log(err) })
})

module.exports = router
