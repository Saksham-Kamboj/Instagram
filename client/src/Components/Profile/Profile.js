import React, { useEffect, useState } from "react";
import './Profile.css';
import PostDetails from "../PostDetails/PostDetails";
import ProfilePic from "../ProfilePic/ProfilePic";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Profile() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("")
  const [changePic, setChangePic] = useState(false)
  const [loading, setLoading] = useState(true);


  // Toast functions
  const notifyA = (msg) => toast.error(msg);

  const removeFromGallery = (postId) => {
    setPic(pic.filter(post => post._id !== postId));
  };

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  const changeProfile = () => {
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  }

  useEffect(() => {
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result.posts);
        setUser(result.user);
        setLoading(false);
      })
      .catch((err) => {
        notifyA(err);
        setLoading(false);
      });
  }, []);


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='profile'>
          <div className="profile-frame">
            <div className="profile-pic">
              <img
                onClick={changeProfile}
                src={user?.Photo ? user.Photo : picLink}
                alt=""
              />
            </div>
            <div className="profile-data">
              <h1>{capitalize(JSON.parse(localStorage.getItem("user")).name)}</h1>
              <h4>{JSON.parse(localStorage.getItem("user")).userName}</h4>
              <div className="profile-info">
                <p>{pic ? pic.length : "0"} posts</p>
                <p>{user.followers ? user.followers.length : "0"} followers</p>
                <p>{user.following ? user.following.length : "0"} following</p>
              </div>
            </div>
          </div>
          <hr className='hr' />
          <div className="gallery">
            {
              pic.map((pics) => {
                return (
                  <img
                    key={pics._id}
                    src={pics.photo} alt=""
                    onClick={() => {
                      toggleDetails(pics)
                    }}
                  />
                )
              })
            }
          </div>
          {show &&
            <PostDetails item={posts} toggleDetails={toggleDetails} removeFromGallery={removeFromGallery} />

          }
          {
            changePic &&
            <ProfilePic changeProfile={changeProfile} />
          }
        </div>
      )};
    </>
  );
}

export default Profile;