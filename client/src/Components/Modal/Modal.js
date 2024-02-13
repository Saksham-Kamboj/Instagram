import React from 'react';
import './Modal.css';
import { RiCloseLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Modal({ setModalOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setModalOpen(false);
    localStorage.clear();
    navigate('./signIn');
    toast.success('Logged out successfully');
  };

  return (
    <div className="darkBg" onClick={() => setModalOpen(false)}>
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className="closeBtn" onClick={() => setModalOpen(false)}>
            <RiCloseLine />
          </button>
          <div className="modalContent">Are you sure you want to log out?</div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button className="logOutBtn" onClick={handleLogout}>
                Log Out
              </button>
              <button className="cancelBtn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
