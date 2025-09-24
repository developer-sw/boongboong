// src/Passwd_Find_Pages/Pwcode.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pwcode.css"; // CSS 파일 경로는 실제 위치에 맞게 조정하세요.

export default function Pwcode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태

  // "완료" 버튼 클릭 시 실행될 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // form 태그의 기본 동작(새로고침) 방지
    if (!code.trim()) {
      setError("인증번호를 입력해주세요.");
      return;
    }

    // --- 데모용 인증 로직 ---
    // 실제 앱에서는 여기서 API 서버로 인증번호를 보내 검증합니다.
    // 임시로 '123456'을 정답으로 설정합니다.
    if (code === "123456") {
      alert("인증되었습니다. 비밀번호를 재설정합니다.");
      navigate("/pwsetting"); // 인증 성공 시 다음 페이지로 이동
    } else {
      setError("인증번호를 다시 확인해주세요."); // 인증 실패 시 에러 메시지 표시
    }
  };

  return (
    <main className="pwcode">
      {/* 뒤로가기 버튼 */}
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
        〈
      </button>

      {/* 제목과 부제목 */}
      <h1 className="title">비밀번호 재설정</h1>
      <p className="subtitle">이메일이 오지 않았다면 정크함을 확인하세요.</p>

      {/* 인증코드 입력 폼 */}
      <form className="card" onSubmit={handleSubmit}>
        <div className="label-row">
          <label className="label">인증코드</label>
          {/* 에러 메시지가 있을 때만 표시 */}
          {error && <span className="label-help error">{error}</span>}
        </div>

        <input
          type="text"
          className={`control ${error ? "invalid" : ""}`} // 에러 시 input 테두리 스타일 변경
          placeholder="인증번호를 입력하세요"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            // 입력값을 변경하면 에러 메시지를 초기화
            if (error) {
              setError("");
            }
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
        />

        {/* 완료 버튼 */}
        <button type="submit" className="btn primary submit" disabled={!code.trim()}>
          완료
        </button>
      </form>
    </main>
  );
}