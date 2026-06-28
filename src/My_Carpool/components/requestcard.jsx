import React from 'react';
import './requestcard.css';

const RequestCard = ({ name, onApprove, onReject, profileImage }) => {
  return (
    <div className="request-card">
      
      {/* 프로필 이미지 로직 적용 */}
      {profileImage ? (
         <img 
           src={profileImage} 
           alt={name} 
           className="profile-circle large"
           style={{ objectFit: 'cover' }} 
         />
      ) : (
        <div className="profile-circle large">
          {name ? name[0] : '?'} 
        </div>
      )}

      <p className="request-text">
        <strong>{name || "알 수 없음"}</strong>님이<br />
        동행을 신청했습니다.
      </p>
      <div className="btn-group">
        <button className="btn accept" onClick={onApprove}>수락</button>
        <button className="btn reject" onClick={onReject}>거절</button>
      </div>
    </div>
  );
};

export default RequestCard;