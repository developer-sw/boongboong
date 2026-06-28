import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Chat } from "../assets/chat.svg"; 
import './openchatnoticemodal.css';

const OpenChatNoticeModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleGoToRegister = () => {
    onClose(); 
    navigate('/openchat-register'); 
  };

  return (
    /* ✨ openchat-notice-modal-container 클래스가 CSS 범위의 기준이 됩니다 */
    <div className="modal-overlay openchat-notice-modal-container">
      <div className="modal-content">
        <h2>이런!<br/>계정에 오픈채팅이 등록되지 않았어요.</h2>
        <p>글 작성을 위해 계정에 오픈채팅 링크를 등록해야 해요.<br/>한 번만 등록하면, 앞으로는 원터치로 대화할 수 있어요.</p>
        
        <Chat className="modal-image" />

        <button className="btn-register" onClick={handleGoToRegister}>
          오픈채팅 등록하러 가기 →
        </button>
      </div>
    </div>
  );
};

export default OpenChatNoticeModal;