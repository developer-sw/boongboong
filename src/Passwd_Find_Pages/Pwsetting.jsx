// src/Passwd_Find_Pages/Pwsetting.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pwsetting.css"; // 아래에서 만들 CSS 파일

export default function Pwsetting() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. 유효성 검사
    if (!password || !confirmPassword) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 2. 유효성 검사 통과 시 (데모)
    // 실제 앱에서는 여기서 API로 비밀번호 변경 요청을 보냅니다.
    setError(""); // 에러 메시지 초기화
    alert("비밀번호가 성공적으로 변경되었습니다.");
    navigate("/signup"); // 로그인 페이지로 이동
  };

  return (
    <main className="pwsetting">
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
        〈
      </button>

      <h1 className="title">비밀번호 재설정</h1>
      <p className="subtitle">봉봉에 오신걸 환영합니다!</p>

      <form className="card" onSubmit={handleSubmit}>
        {/* 새 비밀번호 입력 */}
        <div className="form-group">
          <label className="label">새 비밀번호 입력</label>
          <input
            type="password"
            className="control"
            placeholder="8자 이상 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="form-group">
          <label className="label">새 비밀번호 확인</label>
          <input
            type="password"
            className="control"
            placeholder="다시 한번 입력"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* 에러 메시지 표시 영역 */}
        {error && <p className="error-text">{error}</p>}

        {/* 완료 버튼 */}
        <button type="submit" className="btn primary submit">
          비밀번호 재설정
        </button>
      </form>
    </main>
  );
}