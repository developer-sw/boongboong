import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RouteCard.css'; 

import { ReactComponent as Carimg } from "../assets/carimg.svg";
import { ReactComponent as Calendar } from "../assets/calendar.svg";
import { ReactComponent as RoutePathSvg } from "../assets/path.svg";

export default function RouteCard({ 
  route, 
  isActive = false, 
  isDetail = false, 
  rightElement, 
  onComplete,
  onNoShow, // ★ 추가된 Prop (노쇼 핸들러)
  buttonText = "동행 완료하기", 
  disabled = false            
}) {
  const navigate = useNavigate();

  if (!route) return null; 

  const authorObj = route.author || route.writer || {};
  const displayName = authorObj.nickname || authorObj.nick || authorObj.name || route.name || "알 수 없음";
  let displayImage = authorObj.profileImageUrl || authorObj.profileImg || authorObj.profileImage || route.image;

  const honeyScore = authorObj.trustScore || authorObj.score || route.trustScore || route.score || route.honeyScore || 0;
  const displayFrom = route.from || route.departure || "출발지 미정";
  const displayTo = route.to || route.arrival || "도착지 미정";
  const { id, date, time, memo } = route;

  const handleCardClick = () => {
    if (isDetail) return;
    navigate(`/detail/${id}`); 
  };

  const formattedTime = time ? time.substring(0, 5) : '';

  return (
    <div className={`route-card ${isDetail ? 'detail-view' : ''}`} onClick={handleCardClick}>
      {/* --- 기존 Header/Body 그대로 유지 --- */}
      <div className="card-header">
        <div className="profile">
          {displayImage ? (
             <img src={displayImage} alt={displayName} className="profile-initial" />
          ) : (
            <div className="profile-initial">
              {displayName !== "알 수 없음" ? displayName.charAt(0) : '?'}
            </div>
          )}
          <div className="profile-info">
            <div className="name-row">
              <span className="name">{displayName}</span>
              {rightElement && <div className="badge-inline">{rightElement}</div>}
            </div>
            <span className="points">{honeyScore}꿀벌</span> 
          </div>
        </div>
        {!isDetail && (<div className="datetime"><Calendar /><span>{date} {formattedTime}</span></div>)}
      </div>

      <div className="card-body">
        <div className="car-icon-wrapper"><Carimg /></div>
        <div className="route-details">
          <div className="route-labels"><span className="label start">출발</span><span className="label end">도착</span></div>
          <div className="route-path"><RoutePathSvg className="route-path-visual" /></div>
          <div className="route-locations"><span className="location">{displayFrom}</span><span className="location">{displayTo}</span></div>
        </div>
      </div>

      {/* ★ [수정된 버튼 영역] ★ */}
      {!isDetail && (
        isActive ? (
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            
            {/* 1. 노쇼 버튼 (운전자에게만 보임 - onNoShow가 있을 때) */}
            {onNoShow && (
              <button 
                className="complete-btn"
                style={{ 
                    flex: 1, // 반반 비율
                    backgroundColor: '#FF5252', // 빨간색
                    color: 'white',
                    border: 'none'
                }} 
                onClick={(e) => {
                  e.stopPropagation();
                  onNoShow();
                }}
              >
                노쇼 신고
              </button>
            )}

            {/* 2. 완료/상태 버튼 */}
            <button 
              className={`complete-btn ${disabled ? 'disabled' : ''}`} 
              style={{ 
                  flex: 1, // 반반 비율 (노쇼 없으면 혼자 꽉 참)
                  backgroundColor: disabled ? '#E0E0E0' : '#FEE500', 
                  color: disabled ? '#888' : '#191919',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  border: 'none'
              }}
              onClick={(e) => {
                e.stopPropagation(); 
                if (disabled) return;
                if (onComplete) onComplete(); 
              }}
              disabled={disabled}
            >
              {buttonText}
            </button>
          </div>
        ) : (
          <div className="card-footer">
            <span className="memo-label">메모</span>
            <span className="memo-content">{memo || "메모가 없습니다."}</span>
          </div>
        )
      )}
    </div>
  );
}