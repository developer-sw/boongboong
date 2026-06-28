// src/components/MyVerificationSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./myVerificationSection.css";
import arrowRightIcon from "../assets/Chevron right.svg";

function MyVerificationSection({ licenseStatus = "unverified" }) {
  const navigate = useNavigate();

  let statusText = "";
  let statusClass = "";

  if (licenseStatus === "pending") {
    statusText = "인증 대기중";
    statusClass = "status-pending";
  } else if (licenseStatus === "verified") {
    statusText = "인증완료";
    statusClass = "status-verified";
  } else {
    statusText = "미인증";
    statusClass = "status-unverified";
  }

  const handleLicenseClick = () => {
    // ✅ 운전면허증 등록 페이지
    navigate("/license-register");
  };

  const handleCarClick = () => {
    // ✅ 차량정보 등록 페이지
    navigate("/car-register");
  };

  const handleOpenChatClick = () => {
    // ✅ [수정됨] 오픈채팅 등록 페이지로 이동
    navigate("/openchat-register");
  };

  return (
    <section className="mypage-verify">
      <div className="mypage-verify-card">
        <div className="mypage-verify-label">인증 및 등록</div>

        {/* 1행: 운전면허 등록 */}
        <button
          type="button"
          className="mypage-verify-row"
          onClick={handleLicenseClick}
        >
          <div className="mypage-verify-row-content">
            <div className="mypage-verify-main">운전면허 등록</div>

            <div className="mypage-verify-right">
              <span className={`mypage-verify-status ${statusClass}`}>
                {statusText}
              </span>
              <img
                src={arrowRightIcon}
                alt="운전면허 등록"
                className="mypage-verify-arrow"
              />
            </div>
          </div>
        </button>

        <div className="mypage-verify-divider" />

        {/* 2행: 차량등록 및 사진 */}
        <button
          type="button"
          className="mypage-verify-row"
          onClick={handleCarClick}
        >
          <div className="mypage-verify-row-content">
            <div className="mypage-verify-main">차량등록 및 사진</div>

            <div className="mypage-verify-right">
              <img
                src={arrowRightIcon}
                alt="차량등록 및 사진"
                className="mypage-verify-arrow"
              />
            </div>
          </div>
        </button>

        <div className="mypage-verify-divider" />

        {/* 3행: 오픈채팅 링크 등록 */}
        <button
          type="button"
          className="mypage-verify-row"
          onClick={handleOpenChatClick}
        >
          <div className="mypage-verify-row-content">
            <div className="mypage-verify-main">오픈채팅 링크 등록</div>

            <div className="mypage-verify-right">
              <img
                src={arrowRightIcon}
                alt="오픈채팅 링크 등록"
                className="mypage-verify-arrow"
              />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}

export default MyVerificationSection;