// src/components/CarHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../Driverlicense/licenseHeader.css";           // 기존 헤더 CSS 재사용
import backIcon from "../../assets/Chevron left.svg";

function CarHeader() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="license-header">
      <button
        type="button"
        className="license-header-back"
        onClick={handleBack}
        aria-label="뒤로가기"
      >
        <img
          src={backIcon}
          alt=""
          className="license-header-back-icon"
        />
      </button>

      {/* 제목만 차량정보 등록으로 변경 */}
      <h1 className="license-header-title">차량정보 등록</h1>
    </header>
  );
}

export default CarHeader;
