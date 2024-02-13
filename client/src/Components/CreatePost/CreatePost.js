import React, { useState, useEffect } from "react";
import './CreatePost.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const [body, setBody] = useState("");
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [isPosting, setIsPosting] = useState(false); 
    const navigate = useNavigate();

    // Toast functions
    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)

    useEffect(() => {
        // saving post to mongodb
        if (url) {
            fetch("/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    setIsPosting(false);
                    if (data.error) {
                        notifyA(data.error)
                    } else {
                        notifyB("Successfully Posted")
                        navigate("/")
                    }
                })
                .catch(err => console.log(err))
        }
    }, [url, navigate, body])

    // posting image to cloudinary
    const postDetails = () => {
        if (!isPosting) { 
            setIsPosting(true); 
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "instagramPic")
            data.append("cloud_name", "dwpkrkdpj")
            fetch("https://api.cloudinary.com/v1_1/dwpkrkdpj/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => setUrl(data.url))
                .catch(err => {
                    setIsPosting(false);
                    console.log(err);
                });
        }
    }

    const loadfile = (e) => {
        var output = document.getElementById("output");
        output.src = URL.createObjectURL(e.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src);
        };
    };

    return (
        <div className='createPostContainer'>
            <div className='createPost'>
                <div className="post-header">
                    <h4 style={{ margin: "0 auto" }} >Create New Post</h4>
                </div>
                <div className="main-div">
                    <div className="imgContainer">
                        <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png" alt="" id="output" />
                    </div>
                    <input
                        type="file"
                        accept='image/*'
                        onChange={(e) => {
                            loadfile(e);
                            setImage(e.target.files[0])
                        }}
                    />
                </div>
                <div className="details">
                    <textarea
                        value={body}
                        onChange={(e) => { setBody(e.target.value) }}
                        type="text"
                        placeholder="Write a caption...."
                    />
                    <button id="post-btn" onClick={postDetails} disabled={isPosting}>
                        {isPosting ? "Posting..." : "Share"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreatePost;
