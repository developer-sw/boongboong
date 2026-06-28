// src/components/ProfileEditHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./profileEditHeader.css";
import backIcon from "../assets/weui_back-filled.svg";

function ProfileEditHeader() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 화면으로
  };

  return (
    <header className="profile-edit-header">
      {/* 왼쪽 뒤로가기 버튼 */}
      <button
        type="button"
        className="profile-edit-header-back"
        onClick={handleBack}
        aria-label="뒤로가기"
      >
        <img
          src={backIcon}
          alt="뒤로가기"
          className="profile-edit-header-back-icon"
        />
      </button>

      {/* 가운데 제목 */}
      <h1 className="profile-edit-header-title">프로필 수정</h1>
    </header>
  );
}

export default ProfileEditHeader;
