import './ProfilePic.css'
import React, { useState, useEffect, useRef, useCallback } from "react";

function ProfilePic({ changeProfile }) {
    const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
    const hiddenFileInput = useRef(null);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    // Define postDetails as a useCallback
    const postDetails = useCallback(() => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "instagramPic");
        data.append("cloud_name", "dwpkrkdpj");
        fetch("https://api.cloudinary.com/v1_1/dwpkrkdpj/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => setUrl(data.url))
            .catch((err) => console.log(err));
    }, [image]);

    // Define postPic as a useCallback
    const postPic = useCallback(() => {
        // saving post to mongodb
        fetch("/uploadProfilePic", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                pic: url,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                changeProfile();
                window.location.reload();
            })
            .catch((err) => console.log(err));
    }, [url, changeProfile]);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    useEffect(() => {
        if (image) {
            postDetails();
        }
    }, [image, postDetails]);

    useEffect(() => {
        if (url) {
            postPic();
        }
    }, [url, postPic]);


    return (
        <div className="profilePic darkBg">
            <div className="changePic centered">
                <div className='heading'>
                    <h2>Change Profile Photo</h2>
                </div>
                <div style={{ borderTop: "1px solid #00000030", textAlign: "center" }}>
                    <button
                        className="upload-btn"
                        style={{ color: "#1EA1F7" }}
                        onClick={handleClick}
                    >
                        Upload Photo
                    </button>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            setImage(e.target.files[0]);
                        }}
                    />
                </div>
                <div style={{ borderTop: "1px solid #00000030", textAlign: "center" }}>
                    <button
                        className="upload-btn"
                        style={{ color: "#ED4956" }}
                        onClick={() => {
                            setUrl(picLink);
                            postPic();
                        }}
                    >
                        {" "}
                        Remove Current Photo
                    </button>
                </div>
                <div style={{ borderTop: "1px solid #00000030", textAlign: "center" }}>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "15px",
                        }}
                        onClick={changeProfile}
                    >
                        cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePic
