import React, { useEffect, useState } from "react";
import '../Profile/Profile.css';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function Profile() {
  let picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollow, setIsFollow] = useState(false);
  const [loading, setLoading] = useState(true);

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  // to follow user
  const followUser = (userId) => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsFollow(true);
        notifyB("Follow Successfully..");
      })
      .catch((err) => {
        notifyA(err);
      });

  };

  // to unfollow user
  const unfollowUser = (userId) => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        notifyB("Unfollow Successfully..")
        setIsFollow(false);
      })
      .catch((err) => {
        notifyA(err);
      });
  };

  useEffect(() => {

    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.posts);
        setLoading(false);
        if (
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      })
      .catch((err) => {
        notifyA(err);
        setLoading(false);
      });
  }, [userid, isFollow]);



  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='profile'>
          <div className="profile-frame">
            <div className="profile-pic">
              <img src={user.Photo ? user.Photo : picLink} alt="" />
            </div>
            <div className="profile-data">
              <h1>{user.name}</h1>
              <h4>{user.userName}</h4>
              <button
                className="followBtn"
                onClick={() => {
                  if (isFollow) {
                    unfollowUser(user._id);
                  } else {
                    followUser(user._id);
                  }
                }}
              >
                {isFollow ? "Unfollow" : "Follow"}
              </button>
              <div className="profile-info">

                <p>{posts ? posts.length : "0"} Posts</p>
                <p>{user.followers ? user.followers.length : "0"} Followers</p>
                <p>{user.following ? user.following.length : "0"} Following</p>
              </div>
            </div>
          </div>
          <hr className='hr' />
          <div className="gallery">
            {posts && posts.map((pics) => (
              <img key={pics._id} src={pics.photo} alt="" className="item" />
            ))}
          </div>
        </div>
      )};
    </>
  );
}

export default Profile;
