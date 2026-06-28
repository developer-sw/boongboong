import React from 'react'; // useState는 사용하지 않으면 지워도 됩니다.
import { useNavigate } from 'react-router-dom'; 
import './topnavigate.css';

import { ReactComponent as Back } from '../../assets/back.svg'; 
import { ReactComponent as Setting } from '../../assets/setting.svg'; 

// 1. isMyPage와 onSettingClick(설정 버튼 눌렀을 때 동작) props를 추가했습니다.
const Header = ({ title, onBackClick, isMyPage, onSettingClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  // 설정 버튼 클릭 핸들러 (props로 전달받지 않았을 경우를 대비한 기본 함수)
  const handleMenuClick = () => {
    if (onSettingClick) {
      onSettingClick();
    } else {
      console.log("설정 버튼 클릭됨 (기능을 연결해주세요)");
      navigate('/settings'); 
    }
  };

  return (
      <div className="head-section">
        <header className="top-header">
          {/* 뒤로가기 버튼 */}
          <button 
            className="icon-btn back" 
            onClick={handleBack} 
            aria-label="뒤로가기"
          >
            <Back className="back-icon" width="17" height="17" />
          </button>

          <h1 className="header-title">{title}</h1>

          {/* 2. 조건부 렌더링 적용 
            isMyPage가 true일 때만 설정 버튼을 렌더링합니다.
          */}
          {isMyPage ? (
            <button 
              className="icon-btn menu" 
              aria-label="메뉴"
              onClick={handleMenuClick}
            >
              <Setting className="menu-icon" width="24" height="24" />
            </button>
          ) : (
            /* 3. (선택사항) 레이아웃 균형 유지용 빈 박스 
               만약 설정 버튼이 없을 때 제목이 가운데가 아니라 오른쪽으로 쏠린다면 
               아래 빈 div를 활성화해서 버튼만큼의 공간을 차지하게 해주세요.
               css가 flex space-between이라면 이게 필요할 수 있습니다.
            */
            <div style={{ width: '24px', padding: '10px' }}></div> 
          )}
        </header>
      </div>
  )
}

export default Header;