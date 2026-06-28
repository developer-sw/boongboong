import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateOpenChatUrl } from '../api/mypageApi'; 
import './openchatregisterpage.css';

import { ReactComponent as Chat } from "../assets/chat.svg";
import { ReactComponent as Back } from "../assets/back.svg";

const OpenChatRegisterPage = () => {
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!link) {
      alert("링크를 입력해주세요!");
      return;
    }

    try {
      await updateOpenChatUrl(link); 
      alert("등록이 완료되었습니다!");
      navigate(-1); 
    } catch (error) {
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="register-page-container">
      <header>
        <button className="nav-back-btn" onClick={() => navigate(-1)}>
          <Back width="24" height="24" />
        </button>
        <span className="header-title">오픈채팅 등록</span>
      </header>
      
      {/* 이미지를 content-area 밖으로 이동하여 화면 꽉 차게 배치 */}
      <div className="hero-image-area">
        <Chat className="top-image" />
      </div>

      <div className="content-area">
        <div className="text-group">
          <h3>오픈채팅 링크 등록 <span className="required-dot">*</span></h3>
          <p>카카오톡에서 오픈채팅을 생성하여 붙여넣으세요.</p>
        </div>
        
        <input 
          type="text" 
          placeholder="링크를 붙여넣으세요"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="link-input"
        />

        <button className="btn-submit-yellow" onClick={handleSubmit}>
          계속하기
        </button>
      </div>
    </div>
  );
};

export default OpenChatRegisterPage;