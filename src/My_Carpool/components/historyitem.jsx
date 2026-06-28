import './historyitem.css';
import { ReactComponent as Calendar } from "../../assets/calendar.svg";

// props에 'profileImage' 추가
const HistoryItem = ({ role, name, date, time, departure, arrival, profileImage }) => {
  const displayName = name || "알 수 없음";

  // 시간 포맷팅
  const formattedTime = time ? time.slice(0, 5) : "";

  return (
    <div className="history-item">
      
      {/* 프로필 이미지 로직: RouteCard와 동일하게 처리 */}
      {profileImage ? (
        <img 
          src={profileImage} 
          alt={displayName} 
          className="profile-circle" 
          style={{ objectFit: 'cover' }} // 이미지가 찌그러지지 않게 설정
        />
      ) : (
        <div className="profile-circle">
          {displayName[0]}
        </div>
      )}

      <div className="history-info">
        <div className="top-row">
          <span className="name">{displayName}</span>
          <span className="role-badge">{role}</span>
        </div>

        <div className="route-row">
          {departure} &gt; {arrival}
        </div>
      </div>

      <div className="history-date">
        <Calendar className="calendar-icon" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span>{date}</span>
            {formattedTime && <span style={{ fontSize: '0.85rem', color: '#666' }}>{formattedTime}</span>}
        </div>
      </div>

    </div>
  );
};

export default HistoryItem;