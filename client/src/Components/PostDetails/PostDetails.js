import React, { useState } from "react";
import "./PostDetails.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegGrinTongueSquint } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";


function PostDetails({ item, toggleDetails, removeFromGallery }) {
    const navigate = useNavigate();
    const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
    const notify = (msg) => toast.success(msg);
    const [comment, setComment] = useState("");
    const [data, setData] = useState([]);
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);

    const makeComment = (text, id) => {
        fetch("/comment", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                text: text,
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((posts) => {
                    if (posts._id === result._id) {
                        return result;
                    } else {
                        return posts;
                    }
                });
                setData(newData);
                setComment("");
                notifyB("Comment posted");
            })
            .catch((error) => {
                console.error("Error making comment:", error);
                notifyA("Error making comment:", error);
            });
    };

    const removePost = (postId) => {
        if (window.confirm("Do you really want to delete this post?")) {
            fetch(`/deletePost/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            })
                .then((res) => res.json())
                .then((result) => {
                    toggleDetails();
                    removeFromGallery(postId);
                    navigate("/profile");
                    notify(result.message);
                })
                .catch((error) => {
                    console.error("Error deleting post:", error);
                });
        }
    };

    return (
        <div className="showComment">
            <div className="container" id="container">
                <div className="postPic" id="postPic">
                    <img src={item.photo} alt="" />
                </div>
                <div className="details" id="details">
                    <div className="card-header" id="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                        <div className="card-pic cardPic">
                            <img src={item.postedBy && item.postedBy.Photo ? item.postedBy.Photo : picLink} alt="" />
                        </div>
                        <h5 className="postedBy">{item.postedBy.name}</h5>
                        <div
                            className="deletePost"
                            onClick={() => {
                                removePost(item._id);
                            }}
                        >
                            <MdDeleteForever />
                        </div>
                    </div>

                    <div className="comment-section" id="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                        {item.comments.map((comment) => (
                            <p className="comm" key={comment._id}>
                                <span className="commenter" style={{ fontWeight: "bold" }}>
                                    {comment.postedBy.name}{" "}
                                </span>
                                <span className="commentText">{comment.comment}</span>
                            </p>
                        ))}
                    </div>

                    <div className="card-content">
                        <p>{item.likes.length} Likes</p>
                        <p>{item.body}</p>
                    </div>

                    <div className="add-comment">
                        <FaRegGrinTongueSquint className="face" />
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                            }}
                        />
                        <button
                            className="comment"
                            onClick={() => {
                                makeComment(comment, item._id);
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
            <div className="close-comment" onClick={toggleDetails}>
                <IoIosCloseCircle />
            </div>
        </div>
    );
}

export default PostDetails;
