import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../api/authApi"; // ✅ API import
import "./Pwcode.css";

export default function Pwcode() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pwfind 페이지에서 넘겨준 email 받기
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // 비정상적인 접근(이메일 없이 들어옴) 차단
  useEffect(() => {
    if (!email) {
      alert("잘못된 접근입니다. 처음부터 다시 시도해주세요.");
      navigate("/pwfind");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("인증번호를 입력해주세요.");
      return;
    }

    try {
      // API 호출: 코드 검증
      await authApi.verifyResetCode(email, code);

      alert("인증되었습니다. 비밀번호를 재설정합니다.");
      
      // 성공 시 다음 페이지(Pwsetting)로 email 정보 토스
      navigate("/pwsetting", { state: { email } });

    } catch (err) {
      console.error("인증 실패:", err);
      // 서버 에러 메시지 활용 가능하면 err.response.data.message 등 사용
      setError("인증번호가 일치하지 않거나 만료되었습니다.");
    }
  };

  return (
    <main className="pwcode">
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
        〈
      </button>

      <h1 className="title">비밀번호 재설정</h1>
      <p className="subtitle">
        {email}<br/>
        메일함의 인증코드를 입력해주세요.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="label-row">
          <label className="label">인증코드</label>
          {error && <span className="label-help error">{error}</span>}
        </div>

        <input
          type="text"
          className={`control ${error ? "invalid" : ""}`}
          placeholder="인증번호 6자리"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError("");
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
        />

        <button type="submit" className="btn primary submit" disabled={!code.trim()}>
          인증 확인
        </button>
      </form>
    </main>
  );
}