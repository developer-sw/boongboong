import React from 'react';
import { useNavigate } from 'react-router-dom'; // [추가] 이동 기능 import
import './profile.css';
import { ReactComponent as Pencil } from '../../assets/pencil.svg'; 

const Profile = ({ isMyPage, nickname, initial }) => {
  const navigate = useNavigate(); // [추가] navigate 함수 생성

  const handleEditClick = () => {
    // [수정] 연필 누르면 프로필 수정 페이지로 이동
    navigate('/useredit');
  };

  return (
    <div className="profile-container">
      {/* 아바타 영역 */}
      <div className="profile-avatar">
        <span className="avatar-initial">{initial}</span>
      </div>

      {/* 이름 및 수정 버튼 영역 */}
      <div className="profile-info">
        <h2 className="nickname">{nickname}</h2>
        
        {/* 본인 페이지일 경우에만 연필 아이콘 표시 */}
        {isMyPage && (
          <button 
            className="edit-btn" 
            onClick={handleEditClick} // [수정] 위에서 만든 함수 연결
            aria-label="닉네임 수정"
          >
            <Pencil width="15" height="15" /> 
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;