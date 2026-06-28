import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import './review.css'; // 파일명 확인 필요 (review.css 또는 ReviewPage.css)
import { ReactComponent as Back } from '../assets/back.svg';
import { matchApi } from '../api/matchApi'; // ★ API import

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // RouteCard에서 넘겨준 정보 받기
  const { matchId, targetUserId, targetName } = location.state || {};

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!matchId || !targetUserId) {
      alert("매칭 정보가 올바르지 않습니다.");
      return;
    }

    try {
      // ★ API 호출
      await matchApi.sendReview({
        matchId: matchId,
        targetUserId: targetUserId,
        rating: rating,
        comment: reviewText
      });

      alert("리뷰가 등록되었습니다!");
      navigate('/main'); // 또는 히스토리 등 원하는 곳으로 이동

    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  return (
    <div className="review-page">
      <header className="review-header">
        <button className="back-btn" onClick={handleGoBack}>
          <Back width="24" height="24" />
        </button>
        <h2 className="header-title">리뷰 작성</h2>
        <div className="header-dummy"></div>
      </header>

      <div className="review-content">
        <section className="rating-section">
          {/* targetName이 있으면 이름을 넣어주면 더 자연스럽습니다 */}
          <h3 className="section-label">
            {targetName ? `${targetName}님과의 동행 만족도` : '동행 만족도'}
          </h3>
          <div className="star-container">
            {[1, 2, 3, 4, 5].map((index) => (
              <StarIcon 
                key={index} 
                filled={index <= rating} 
                onClick={() => setRating(index)} 
              />
            ))}
          </div>
        </section>

        <section className="text-section">
          <h3 className="section-label">이 동행에 대해</h3>
          <textarea 
            className="review-textarea"
            placeholder="동행에 대한 감사를 표현해보세요"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </section>
      </div>

      <div className="review-footer">
        <button 
          className="submit-btn" 
          disabled={rating === 0} // 별점은 필수
          onClick={handleSubmit}
        >
          리뷰 업로드
        </button>
      </div>
    </div>
  );
};

// (StarIcon 컴포넌트는 기존과 동일하게 유지)
const StarIcon = ({ filled, onClick }) => {
  return (
    <svg 
      width="40" height="40" viewBox="0 0 24 24" fill="none" 
      xmlns="http://www.w3.org/2000/svg" onClick={onClick} style={{ cursor: 'pointer' }}
    >
      <path 
        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27Z" 
        fill={filled ? "#FFD600" : "none"} 
        stroke={filled ? "#FFD600" : "#C4C4C4"} 
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReviewPage;