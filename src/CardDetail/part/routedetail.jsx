import React from 'react';
import RouteCard from '../../components/RouteCard';
import { ReactComponent as Maps } from '../../assets/maps.svg'; 
import './routedetail.css';

const RouteDetail = ({ routeData }) => {
  if (!routeData) return null;

  // [수정] 서버 데이터(로그 내용)에 맞춰 이름표 연결
  const cardInfo = {
    ...routeData,
    
    // 1. 위치 정보 연결
    departure: routeData.from,
    arrival: routeData.to,

    // 2. 작성자 정보 연결 (가장 중요!)
    // RouteCard가 'writer'를 찾을 수도, 'name'을 찾을 수도 있어서 둘 다 연결해줍니다.
    writer: routeData.author, 
    
    // author가 있으면 nickname을 쓰고, 없으면 '알 수 없음'
    name: routeData.author ? routeData.author.nickname : '알 수 없음',
    
    // 프로필 이미지 연결 (로그에 profileImageUrl로 들어옴)
    image: routeData.author ? routeData.author.profileImageUrl : null,
  };

  return (
    <div className="route-detail-container">
      <div className="header-wrapper">
        <RouteCard route={cardInfo} isDetail={true} />
      </div>

      <section className="info-section">
        <h3 className="section-title">
           <Maps width="20" height="20" /> 
           경로 상세정보
        </h3>
        <div className="info-grid">
          <div className="info-row">
            <span className="label">출발시각</span>
            <span className="value">{routeData.date} {routeData.time}</span>
          </div>
          <div className="info-row">
            <span className="label">출발지</span>
            <span className="value">{routeData.from}</span>
          </div>
          <div className="info-row">
            <span className="label">도착지</span>
            <span className="value">{routeData.to}</span>
          </div>
        </div>
      </section>

      <section className="memo-section">
        <span className="memo-tag">메모</span>
        <p className="memo-text">
          {routeData.memo || "작성된 메모가 없습니다."}
        </p>
      </section>
      <hr className="detail-divider" />
    </div>
  );
};

export default RouteDetail;