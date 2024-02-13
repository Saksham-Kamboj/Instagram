import './App.css'
import logo from './Images/logo.png';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Components/Header/Header';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import CreatePost from './Components/CreatePost/CreatePost';
import { LoginContext } from "./context/LoginContext";
import Modal from "./Components/Modal/Modal";
import UserProfile from "./Components/UserProfile/UserProfile";
import MyFollowingPost from "./Components/MyFollowingPost/MyFollowingPost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Messanger from './Components/Messanger/Messanger';

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
        <>
          <div className="mobileLogo">
            <img src={logo} alt="" />
          </div>
          <div className="window">
            <Header login={userLogin} />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/signUp' element={<SignUp />} />
              <Route path='/signIn' element={<SignIn />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/createPost' element={<CreatePost />} />
              <Route path='/profile/:userid' element={<UserProfile />} />
              <Route path="/followingpost" element={<MyFollowingPost />}></Route>
              <Route path="/messanger" element={<Messanger />}></Route>
            </Routes>
          </div>
          <ToastContainer theme='dark' autoClose={1500} />
          {modalOpen && <Modal setModalOpen={setModalOpen} />}
        </>
      </LoginContext.Provider>
    </BrowserRouter>
  );
}

export default App;
