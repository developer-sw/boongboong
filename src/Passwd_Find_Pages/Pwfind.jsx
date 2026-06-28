import React, { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { authApi } from "../api/authApi"; // ✅ API import 경로 확인
import "./Pwfind.css";

const EMAIL_DOMAIN = "@office.hanseo.ac.kr";

export default function Pwfind() {
  const navigate = useNavigate();
  
  // --- form states
  const [emailId, setEmailId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- validation
  const emailIdValid = useMemo(() => /^[0-9]{9}$/i.test(emailId), [emailId]);
  const hasTouched = {
    email: emailId.length > 0,
  };

  const formValid = emailIdValid && !isLoading;

  // --- submit
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    const email = `${emailId}${EMAIL_DOMAIN}`;
    setIsLoading(true);

    try {
      // 1. 인증 코드 전송 API 호출
      await authApi.sendResetCode(email);
      
      alert(`인증 코드가 발송되었습니다.\nEmail: ${email}`);

      // 2. 성공 시 다음 페이지로 이동하면서 email 상태 전달
      navigate("/pwcode", { state: { email } }); 
      
    } catch (error) {
      console.error("코드 전송 실패:", error);
      alert("인증 코드 전송에 실패했습니다. 학번을 확인하거나 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pwfind">
      <header className="pwfind-header">
        <button className="back-btn" type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>〈</button>
        <h1 className="title">비밀번호 찾기</h1>
        <p className="subtitle">학번을 입력하면 학교 이메일로 인증코드가 전송됩니다.</p>
      </header>

      <form className="login-card" onSubmit={onSubmit} noValidate>
        {/* 이메일 */}
        <div className="form-group">
          <div className="label-row">
            <label className="label">아이디 (이메일)</label>
            {hasTouched.email && !emailIdValid && (
              <span className="error-msg">학번 9자리를 확인해주세요</span>
            )}
          </div>

          <div className={`input-with-suffix ${hasTouched.email && !emailIdValid ? "invalid" : ""}`}>
            <input
              type="text"
              placeholder="학번 입력"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              inputMode="numeric"
              maxLength="9"
              autoComplete="username"
            />
            <span className="suffix">{EMAIL_DOMAIN}</span>
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={!formValid}>
          {isLoading ? "전송 중..." : "이메일로 코드 받기"}
        </button>
      </form>
    </div>
  );
}