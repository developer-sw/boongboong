// src/components/LicenseInfoSection.jsx
import React from "react";
import "./licenseInfoSection.css";

// formData와 handleChange를 props로 받습니다.
function LicenseInfoSection({ formData, handleChange }) {
  return (
    <section className="license-info-section">
      {/* 제목 + 필수 표시 */}
      <div className="license-section-title-row">
        <h2 className="license-section-title">면허증 정보</h2>
        <span className="license-section-required">*</span>
      </div>

      {/* 면허증 번호 */}
      <div className="license-info-field">
        <label className="license-info-label" htmlFor="licenseNumber">
          면허증 번호
        </label>
        <div className="license-info-input-box">
          <input
            id="licenseNumber" // 상태 키: licenseNumber
            type="text"
            className="license-info-input"
            placeholder="12-34-567890-12"
            value={formData.licenseNumber} // 값 연결
            onChange={handleChange} // 변경 핸들러 연결
          />
        </div>
      </div>

      {/* 면허 종류 */}
      <div className="license-info-field">
        <label className="license-info-label" htmlFor="licenseType">
          면허 종류
        </label>
        <div className="license-info-input-box">
          <input
            id="licenseType" // 상태 키: licenseType
            type="text"
            className="license-info-input"
            placeholder="1종보통"
            value={formData.licenseType}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 발급일 */}
      <div className="license-info-field">
        <label className="license-info-label" htmlFor="issuedAt">
          발급일
        </label>
        <div className="license-info-input-box">
          <input
            id="issuedAt" // 상태 키: issuedAt
            type="text"
            className="license-info-input"
            placeholder="연도. 월. 일."
            value={formData.issuedAt}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 만료일 */}
      <div className="license-info-field">
        <label className="license-info-label" htmlFor="expiresAt">
          만료일
        </label>
        <div className="license-info-input-box">
          <input
            id="expiresAt" // 상태 키: expiresAt
            type="text"
            className="license-info-input"
            placeholder="연도. 월. 일."
            value={formData.expiresAt}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}

export default LicenseInfoSection;