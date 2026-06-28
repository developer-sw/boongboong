import React, { useState } from 'react';
// 1. useNavigate import 추가
import { useNavigate } from 'react-router-dom'; 
import './head.css';

import { ReactComponent as Back } from '../../assets/back.svg'; 
import { ReactComponent as Menu } from '../../assets/menu.svg'; 

const Header = ({ title, onBackClick }) => {
  const [showModal, setShowModal] = useState(false);
  
  // 2. navigate 훅 가져오기
  const navigate = useNavigate();

  // 3. 뒤로가기 핸들러 함수
  const handleBack = () => {
    // 만약 부모에서 onBackClick을 따로 전달했다면 그걸 실행 (커스텀 기능)
    if (onBackClick) {
      onBackClick();
    } else {
      // 전달된 게 없다면 기본적으로 뒤로 가기 (-1은 이전 페이지를 의미)
      navigate(-1);
    }
  };

  const handleMenuClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="head-section">
        <header className="top-header">
          {/* 4. onClick에 handleBack 연결 */}
          <button 
            className="icon-btn back" 
            onClick={handleBack} 
            aria-label="뒤로가기"
          >
            <Back className="back-icon" width="17" height="17" />
          </button>

          <h1 className="header-title">{title}</h1>

          <button 
            className="icon-btn menu" 
            aria-label="메뉴"
            onClick={handleMenuClick}
          >
            <Menu className="menu-icon" width="24" height="24" />
          </button>
        </header>
      </div>

      {/* 모달 영역 (기존 유지) */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-group">
              <button className="modal-btn warning">신고하기</button>
              <div className="modal-divider"></div>
              <button className="modal-btn">차단하기</button>
            </div>
            <div className="modal-group">
              <button className="modal-btn" onClick={handleCloseModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;