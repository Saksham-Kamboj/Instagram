import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { LoginContext } from "../../context/LoginContext";
import "./Header.css";
import logo from '../../Images/logo.png';
import { FaHome, FaPlusCircle, FaUserFriends, FaPenNib } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { FaCircleArrowRight } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { RxExit } from "react-icons/rx";




function Header() {
  const { setModalOpen } = useContext(LoginContext);
  const isLoggedIn = () => {
    const token = localStorage.getItem("jwt");
    return token;
  };

  const renderNavItems = () => {
    if (isLoggedIn()) {
      return (
        <>
          <li>
            <Link to="/">
              <FaHome className="navIconBtn" />
              <span className="span">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/createPost">
              <FaPlusCircle className="navIconBtn" />
              <span className="span">CreatePost</span>
            </Link>
          </li>
          <li>
            <Link to="/followingpost">
              <FaUserFriends className="navIconBtn" />
              <span className="span">Following Posts</span>
            </Link>
          </li>
          <li>
            <Link to="/messanger">
              <RiMessage2Fill className="navIconBtn" />
              <span className="span">Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="profileName">
              <CgProfile className="navIconBtn" />
              <span className="span">Profile</span>
            </Link>
          </li>
          <li>
            <button className='primaryBtn' onClick={() => setModalOpen(true)}>
              <RxExit className="navIconBtn logout" />
              <span className="span span2">LogOut</span>
            </button>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <Link to="/signUp"><FaPenNib className="navIconBtn" />
              {/* <span className="span">SignUp</span> */}
              SignUp
            </Link>
          </li>
          <li>
            <Link to="/signIn">
              <FaCircleArrowRight className="navIconBtn" />
              {/* <span className="span">SignIn</span> */}
              SignIn
            </Link>
          </li>
        </>
      );
    }
  };

  return (
    <>
      <div className='navbar'>
        <img src={logo} alt="Nav logo" className="logo" />
        <ul className='nav-menu'>
          {renderNavItems()}
        </ul>
      </div>
    </>
  );
}

export default Header;
