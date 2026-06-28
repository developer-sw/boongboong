// src/components/SettingsHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./settingsHeader.css";
import backIcon from "../assets/weui_back-filled.svg?url"; // 뒤로가기 아이콘 (14 x 28)

function SettingsHeader() {
  const navigate = useNavigate();

  const handleBack = () => {
    // 이전 화면으로 돌아가기
    navigate(-1);
  };

  return (
    <header className="settings-header">
      {/* 왼쪽 뒤로가기 버튼 */}
      <button
        type="button"
        className="settings-header-back"
        onClick={handleBack}
        aria-label="뒤로가기"
      >
        <img src={backIcon} alt="" className="settings-header-back-icon" />
      </button>

      {/* 중앙 "설정" 텍스트 */}
      <h1 className="settings-header-title">설정</h1>
    </header>
  );
}

export default SettingsHeader;
