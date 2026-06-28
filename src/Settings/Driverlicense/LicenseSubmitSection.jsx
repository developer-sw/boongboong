// src/components/LicenseSubmitSection.jsx (수정)
import React from "react";
import "./licenseSubmitSection.css";

// 부모 컴포넌트로부터 handleSubmit 함수를 prop으로 받습니다.
function LicenseSubmitSection({ handleSubmit }) { 
  return (
    <section className="license-submit-section">
      {/* 위/아래 영역을 완전히 분리해 주는 회색 선 */}
      <div className="license-submit-divider" />

      {/* 운전면허증 등록하기 버튼 */}
      <button
        type="button"
        className="license-submit-button"
        onClick={handleSubmit} // 부모로부터 받은 handleSubmit 함수를 호출
      >
        운전면허증 등록하기
      </button>
    </section>
  );
}

export default LicenseSubmitSection;