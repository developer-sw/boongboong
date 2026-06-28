import React from 'react';
import './driverinfo.css';
import { ReactComponent as Handle } from '../../assets/handle.svg'; 
import { ReactComponent as Honey } from '../../assets/honey.svg'; 

const DriverInfo = ({ driverData, reviewData }) => {
  
  // 1. 운전자 정보 가져오기
  const name = driverData?.nickname || "알 수 없음";
  
  // ★ [수정] 이미지 경로 안전하게 찾기 (서버 필드명 대응: profileImageUrl, profileImg, image)
  const profileImg = driverData?.profileImageUrl 
                  || driverData?.profileImg 
                  || driverData?.image;
                  
  const honeyScore = driverData?.trustScore || 0; 

  // =========================================================
  // [주석 처리] 리뷰 데이터 처리 로직
  // =========================================================
  /*
  const reviews = (reviewData && Array.isArray(reviewData)) ? reviewData : [];

  // ★ 별점 렌더링 헬퍼 함수 (숫자 -> 별 문자)
  const renderStars = (score) => {
    const filled = '★'.repeat(score);
    const empty = '☆'.repeat(5 - score);
    return <span style={{ color: '#FFD600', letterSpacing: '-2px' }}>{filled}{empty}</span>;
  };
  */

  return (
    <div className="driver-info-container">
      {/* 1. 섹션 헤더 */}
      <h2 className="section-title">
        <Handle width="20" height="20" className="icon-handle" />
        드라이버 정보
      </h2>

      {/* 2. 프로필 요약 */}
      <div className="profile-header">
        <div className="profile-user">
          {profileImg ? (
             <img 
               src={profileImg} 
               alt={name} 
               className="avatar-circle" 
               style={{ objectFit: 'cover' }}
               // 이미지 로드 실패 시 이니셜 처리 (선택사항)
               onError={(e) => {
                 e.target.style.display = 'none';
                 // 여기서 대체 텍스트나 기본 이미지를 보여주는 로직을 추가할 수도 있습니다.
               }}
             />
          ) : (
            <div className="avatar-circle">
              {name.charAt(0)}
            </div>
          )}
          <span className="user-name">{name}</span>
        </div>
        {/*
        <div className="total-rating">
          <span className="star-icon">★</span>
          {/* 전체 평점 (데이터가 없으면 5.0 기본값) 
          <span className="score">{driverData?.averageRating || "5.0"}</span>
        </div>
        */}
      </div>
      

      {/* 3. 매너 지표 */}
      <div className="manner-section">
        <div className="manner-text-col">
          <p className="manner-main-text">
            {name} 님은 {honeyScore}단지의 <br />
            <strong>달달한 단지입니다!</strong>
          </p>
          
          <div className="manner-help">
            <span className="help-label"> 단지란?</span>
            <p className="help-desc">
            동행 및 노쇼 횟수, 붕붕 사용자로부터 받은 리뷰 등을 
            종합해서 만든 매너 지표예요.
            </p> 
          </div>
        </div>
        
        <div className="manner-img-col">
           <Honey width="90" height="90" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* [주석 처리] 리뷰 카드 리스트 영역 (JSX)                        */}
      {/* ========================================================= */}
      {/* <div className="review-scroll-area">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={review.reviewId || index} className="review-card">
              
              <div className="card-stars">
                {renderStars(review.rating || 5)}
              </div>
              
              <p className="card-text">
                {review.comment || review.content || "내용이 없습니다."}
              </p>
              
              <span className="reviewer-name">
                {review.writer?.nickname || review.reviewer || "익명"}
              </span>
            </div>
          ))
        ) : (
          <div className="no-review-msg" style={{ padding: '20px 0', textAlign: 'center', color: '#999', fontSize: '14px' }}>
            아직 작성된 리뷰가 없습니다.
          </div>
        )}

        {reviews.length > 0 && (
          <div className="see-more-item">
            <button className="see-more-btn" aria-label="리뷰 더보기">
              ➜
            </button>
            <span className="see-more-text">더보기</span>
          </div>
        )}
      </div> 
      */}

      <hr className="detail-divider" />
    </div>
  );
};

export default DriverInfo;