

// 1. 위쪽 영역 컴포넌트 (지도 + 슬라이더)
import Myheader from "./components/myheader"; 

// 2. 아래쪽 영역 컴포넌트 (탭 + 리스트)
// 방금 만든 history.jsx를 가져옵니다. 경로를 꼭 확인하세요!
import Assemble from "./components/assemble"; 

import './carpool.css'; 

const Carpool = () => {
  return (
    <div className="carpool-page-wrapper">
      
      {/* 상단: 지도와 슬라이드 카드 */}
      <div className="top-section">
        <Myheader />
      </div>

      {/* 하단: 신청 목록과 성사된 기록 */}
      {/* History 컴포넌트 안에 탭과 리스트가 다 들어있습니다 */}
      <div className="bottom-section">
        <Assemble />
      </div>

    </div>
  );
};

export default Carpool;