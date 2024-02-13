import React, { useEffect, useState } from "react";
import '../Home/Home.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader"
import { PiHeartStraightFill, PiHeartStraightLight } from "react-icons/pi";
import { FaRegGrinTongueSquint } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

function MyFollowingPost() {
    const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    const [show, setShow] = useState(false);
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(true);

    // Toast functions
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("./signup");
        }

        // Fetching all posts
        fetch("myfollwingpost", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                notifyA("Your following empty");
            });
    }, [navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (loading && data.length === 0) {
                setLoading(false);
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [loading, data.length]);



    // to show and hide comments
    const toggleComment = (posts) => {
        if (show) {
            setShow(false);
        } else {
            setShow(true);
            setItem(posts);
        }
    };

    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
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
            });
    };
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
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
            });
    };

    // function to make comment
    const makeComment = (text, id) => {
        fetch("/comment", {
            method: "put",
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
            });
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (<div className="home">
                {/* card */}
                {data.length === 0 ? (
                    <p className="dataNoAvailable">
                        Your following is empty..., <br /><br />
                        Follow anyone <br />
                        <span> 🤪 </span>
                    </p>
                ) : (data.map((posts) => {
                    return (
                        <div className="card" key={posts._id}>
                            {/* card header */}
                            <div className="card-header">
                                <div className="card-pic">
                                    <img
                                        src={posts.postedBy.Photo ? posts.postedBy.Photo : picLink}
                                        alt=""
                                    />
                                </div>
                                <div className="userName">
                                    <h5>
                                        <Link to={`/profile/${posts.postedBy._id}`}>
                                            {posts.postedBy.name}
                                        </Link>
                                    </h5>
                                </div>
                            </div>
                            {/* card image */}
                            <div className="cardContent">
                                <div className="postBody">
                                    <p>{posts.body}</p>
                                </div>
                                <div className="postImg">
                                    <img src={posts.photo} alt="" />
                                </div>
                            </div>

                            {/* card content */}
                            <div className="card-content">
                                {posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ? (
                                    <PiHeartStraightFill
                                        className="like"
                                        onClick={() => unlikePost(posts._id)}
                                    />
                                ) : (
                                    <PiHeartStraightLight
                                        className="unlike"
                                        onClick={() => likePost(posts._id)}
                                    />
                                )}
                                <p>{posts.likes.length} Likes</p>
                                <p
                                    style={{ fontWeight: "bold", cursor: "pointer" }}
                                    onClick={() => toggleComment(posts)}
                                >
                                    View all comments
                                </p>
                            </div>

                            {/* add Comment */}
                            <div className="add-comment">
                                <FaRegGrinTongueSquint className="face" />
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button
                                    className="comment"
                                    onClick={() => makeComment(comment, posts._id)}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    );
                })
                )}
                {/* show Comment */}
                {show && (
                    <div className="showComment">
                        <div className="container" id="container">
                            <div className="postPic" id="postPic">
                                <img src={item.photo} alt="" />
                            </div>
                            <div className="details" id="details">
                                {/* card header */}
                                <div
                                    className="card-header"
                                    id="card-header"
                                    style={{ borderBottom: "1px solid #00000029" }}
                                >
                                    <div className="card-pic">
                                        <img
                                            src={item.postedBy.Photo ? item.postedBy.Photo : picLink}
                                            alt=""
                                        />
                                    </div>
                                    <h5>{item.postedBy.name}</h5>
                                </div>

                                {/* commentSection */}
                                <div
                                    className="comment-section"
                                    id="comment-section"
                                    style={{ borderBottom: "1px solid #00000029" }}
                                >
                                    {item.comments.map((comment, index) => (
                                        <p className="comm" key={index}>
                                            <span
                                                className="commenter"
                                                style={{ fontSize: "15px", fontWeight: "bold" }}
                                            >
                                                {comment.postedBy.name}{" - "}
                                            </span>
                                            <span className="commentText">{comment.comment}</span>
                                        </p>
                                    ))}
                                </div>

                                {/* card content */}
                                <div className="card-content">
                                    <p>{item.likes.length} Likes</p>
                                    <p>{item.body}</p>
                                </div>

                                {/* add Comment */}
                                <div className="add-comment">
                                    <FaRegGrinTongueSquint className="face" />
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <button
                                        className="comment"
                                        onClick={() => {
                                            makeComment(comment, item._id);
                                            toggleComment();
                                        }}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="close-comment"
                            onClick={() => toggleComment()}
                        >
                            <IoIosCloseCircle />
                        </div>
                    </div>
                )}
            </div>
            )}
        </>
    );
}

export default MyFollowingPost;
