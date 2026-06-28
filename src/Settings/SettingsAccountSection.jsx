// src/components/SettingsAccountSection.jsx
import React from "react";
import "./settingsAccountSection.css";

/**
 * 설정 영역 (로그아웃 / 회원탈퇴)
 * onLogout, onWithdraw 콜백을 넘겨주면 실제 백엔드 연동 시 여기서 호출하면 됨.
 */
function SettingsAccountSection({ onLogout, onWithdraw }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("로그아웃 클릭");
    }
  };

  const handleWithdraw = () => {
    if (onWithdraw) {
      onWithdraw();
    } else {
      console.log("회원탈퇴 클릭");
    }
  };

  return (
    <section className="settings-account">
      <div className="settings-account-card">
        {/* 상단 라벨 */}
        <div className="settings-account-label">설정</div>

        {/* 1행: 로그아웃 */}
        <button
          type="button"
          className="settings-account-row"
          onClick={handleLogout}
        >
          <div className="settings-account-row-inner settings-account-row-logout">
            로그아웃
          </div>
        </button>

        <div className="settings-account-divider" />

        {/* 2행: 회원탈퇴 */}
        <button
          type="button"
          className="settings-account-row"
          onClick={handleWithdraw}
        >
          <div className="settings-account-row-inner settings-account-row-withdraw">
            회원탈퇴
          </div>
        </button>
      </div>
    </section>
  );
}

export default SettingsAccountSection;
