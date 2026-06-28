// src/components/LicenseHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./licenseHeader.css";
import backIcon from "../../assets/Chevron left.svg"; // 실제 파일명에 맞게

function LicenseHeader() {
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

      <h1 className="license-header-title">운전면허증 등록</h1>
    </header>
  );
}

export default LicenseHeader;
