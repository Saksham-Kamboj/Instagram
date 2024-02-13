import React, { useState } from "react";
import './SignUp.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  // Toast functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;



  const postData = (e) => {
    e.preventDefault();
    //checking email
    if (!emailRegex.test(email)) {
      notifyA("Invalid email")
      return
    } else if (!passRegex.test(password)) {
      notifyA("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")
      return
    }

    // Sending data to server
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        } else {
          notifyB(data.message)
          navigate("/signIn")
          return false;
        }
      })
  }


  return (
    <div className="signUp">
      <div className="form-container">
        <form className="form" onSubmit={(e) => postData(e)}>
          <h2>Sign Up</h2>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Full Name"
            required
            autoComplete="new-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            required
            autoComplete="new-username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
            autoComplete="new-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" id="submit-btn" value="Sign Up" />
          <div className="formLink">
            Already have an account ?
            <Link to="/signin">
              <span>Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
