import React from 'react';
import './sentrequestitem.css';

const SentRequestItem = ({ name, targetName, profileImage }) => {
  // 화면에 표시할 이름 결정 (상대방 이름 우선)
  const displayName = targetName || name || "알 수 없음";

  return (
    <div className="sent-request-item">
      {/* 프로필 이미지 로직 적용 */}
      {profileImage ? (
        <img 
          src={profileImage} 
          alt={displayName} 
          className="profile-circle small"
          style={{ objectFit: 'cover' }} 
        />
      ) : (
        <div className="profile-circle small">
          {displayName ? displayName[0] : '?'}
        </div>
      )}
      
      <p className="sent-text">
        {targetName ? (
           <><strong>{targetName}</strong>님에게 동행을 신청했습니다.</>
        ) : (
           <>{name || "알 수 없음"}</>
        )}
      </p>
    </div>
  );
};

export default SentRequestItem;