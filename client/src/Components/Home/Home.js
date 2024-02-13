import React, { useEffect, useState } from "react";
import './Home.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { PiHeartStraightFill, PiHeartStraightLight } from "react-icons/pi";
import { FaRegGrinTongueSquint } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import Loader from "../Loader/Loader";

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Home() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  // Toast functions
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const fetchPosts = () => {
        // Fetching all posts
        fetch(`/allposts?limit=${limit}&skip=${skip}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
        .then((res) => res.json())
        .then((result) => {
            // Append new posts to the existing data
            setData((prevData) => [...prevData, ...result]);
            setLoading(false);
        })
        .catch((err) => {
            setLoading(false);
        });
    };

    const token = localStorage.getItem("jwt");
    if (!token) {
        navigate("./signup");
    }

    const handleScroll = () => {
        if (
            document.documentElement.clientHeight + document.pageYOffset >=
            document.documentElement.scrollHeight
        ) {
            setSkip((prevSkip) => prevSkip + limit);
        }
    };

    fetchPosts();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
}, [navigate, skip]);


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
    setShow(!show);
    setItem(posts);
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
        const newData = data.map((post) => (post._id === result._id ? result : post));
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
        const newData = data.map((post) => (post._id === result._id ? result : post));
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
        const newData = data.map((post) => (post._id === result._id ? result : post));
        setData(newData);
        setComment("");
        notifyB("Comment posted");
      });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="home">
          {/* card */}
          {data.length === 0 ? (
            <p className="dataNoAvailable">No data available..., Please create Post</p>
          ) : (
            data.map((posts, index) => (
              <div className="card" key={posts._id + index}>
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
                        {capitalize(posts.postedBy.name)}
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
            ))
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

export default Home;
