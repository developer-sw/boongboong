import React, { useState } from 'react'; // 1. useState import
import './mannerscore.css';
import { ReactComponent as Info } from '../../assets/info.svg';
import { ReactComponent as Honey } from '../../assets/honey.svg';

const MannerScore = ({ score = 0 }) => {
  // 2. 툴팁 상태 관리 (false: 안보임, true: 보임)
  const [showTooltip, setShowTooltip] = useState(false);

  const MAX_SCORE = 1000; 
  const percentage = Math.min(100, Math.max(0, (score / MAX_SCORE) * 100));

  return (
    <div className="manner-container">
      <div className="manner-header">
        {/* 3. 부모 요소에 relative를 줘서 툴팁이 이 안에서 위치를 잡게 함 */}
        <div className="title-row" style={{ position: 'relative' }}>
          <span className="title-text">매너 꿀벌</span>
          
          {/* 4. 클릭 이벤트 추가 */}
          <div 
            className="info-btn" 
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <Info className="info-icon" width="16" height="16" />
          </div>

          {/* 5. 툴팁 내용 (showTooltip이 true일 때만 보임) */}
          {showTooltip && (
            <div className="tooltip-box">
              매너꿀벌은 붕붕 사용자로부터 받은 리뷰, 동행 및 노쇼 횟수 등을 종합해서 만든 매너 지표예요.
              <div className="tooltip-arrow"></div>
            </div>
          )}
        </div>

        <div className="score-row">
          <span className="score-text">{score}단지</span>
          <Honey className="honey-icon" width="24" height="24" />
        </div>
      </div>

      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MannerScore;