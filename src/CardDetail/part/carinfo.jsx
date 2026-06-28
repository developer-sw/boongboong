// src/components/part/carinfo.jsx
import React from 'react';
import './carinfo.css';
import { ReactComponent as Cardetail } from '../../assets/cardetail.svg';
import { ReactComponent as NoImageIcon } from '../../assets/camera.svg';

// 백엔드 주소 (이미지가 상대 경로로 올 때 붙여주기 위함)
const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const CarInfo = ({ carData }) => {
  // 1. 데이터 필드명 매핑
  const plateNumber = carData?.carNumber || carData?.number;
  const carImage = carData?.carImageUrl || carData?.imageUrl; // <-- 여기가 문제!
  const seatCount = carData?.seats || carData?.seat;

  // 2. 데이터 유효성 검사
  const hasCarInfo = !!plateNumber;

  // 3. 이미지 URL 처리 함수
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  // 4. 좌석 수 처리 함수
  const getSeatInfo = (seats) => {
    const seatNum = Number(seats);
    if (!seats || isNaN(seatNum) || seatNum === 0) {
      return '-';
    }
    return `${seatNum}인 탑승`;
  };

  return (
    <div className="car-info-container">
      {/* 타이틀 영역 */}
      <div className="car-info-title">
        <Cardetail width="20" height="20" className="title-icon" />
        <h3>차량 정보</h3>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="car-info-content">
        
        {/* 왼쪽: 텍스트 정보 */}
        <div className="info-text-group">
          {/* 상단: 번호판 및 색상 */}
          <div className="info-row top-row">
            <div className={`info-box plate-box ${!hasCarInfo ? 'no-data' : ''}`}>
              {hasCarInfo ? plateNumber : '정보 없음'}
            </div>
            <span className="separator">•</span>
            <span className="color-text">
              {carData?.color || '-'}
            </span>
          </div>
          
          {/* 하단: 탑승 인원 */}
          <div className="info-row">
            <div className={`info-box passenger-box ${!hasCarInfo ? 'no-data' : ''}`}>
              {hasCarInfo ? getSeatInfo(seatCount) : '-'}
            </div>
          </div>
        </div>

        {/* 오른쪽: 차량 이미지 또는 플레이스홀더 */}
        <div className="info-image-group">
          {hasCarInfo && carImage ? (
            <img 
              src={getImageUrl(carImage)} 
              alt="차량 이미지" 
              className="car-image" 
              onError={(e) => {
                e.target.style.display = 'none'; 
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="image-placeholder">
              <NoImageIcon width="24" height="24" className="placeholder-icon" />
            </div>
          )}
           {/* 이미지 로드 실패 시 보여줄 백업용 */}
           <div className="image-placeholder" style={{display: 'none'}}>
              <NoImageIcon width="24" height="24" className="placeholder-icon" />
           </div>
        </div>
      </div>
       <hr className="detail-divider" />
    </div>
  );
};

export default CarInfo;