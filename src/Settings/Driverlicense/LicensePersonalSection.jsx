// src/components/LicensePersonalSection.jsx
import React from "react";
import "./licensePersonalSection.css";

// formData와 handleChange를 props로 받습니다.
function LicensePersonalSection({ formData, handleChange }) {
  return (
    <section className="license-personal-section">
      {/* 제목 + 필수표시 */}
      <div className="license-personal-title-row">
        <h2 className="license-personal-title">개인정보</h2>
        <span className="license-personal-required">*</span>
      </div>

      {/* 이름 */}
      <div className="license-personal-field">
        <label className="license-personal-label">이름</label>
        <div className="license-personal-input-box">
          <input
            name="name" // 상태 키와 일치하는 name 속성 추가
            type="text"
            className="license-personal-input"
            placeholder="홍길동"
            value={formData.name} // 값 연결
            onChange={handleChange} // 변경 핸들러 연결
          />
        </div>
      </div>

      {/* 생년월일 */}
      <div className="license-personal-field">
        <label className="license-personal-label">생년월일</label>
        <div className="license-personal-input-box">
          <input
            name="birthDate" // 상태 키와 일치하는 name 속성 추가
            type="text"
            className="license-personal-input"
            placeholder="연도.월.일."
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 주소 */}
      <div className="license-personal-field">
        <label className="license-personal-label">주소</label>
        <div className="license-personal-input-box">
          <input
            name="address" // 상태 키와 일치하는 name 속성 추가
            type="text"
            className="license-personal-input"
            placeholder="서울특별시 강남구..."
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}

export default LicensePersonalSection;