import React, { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Pwfind.css";

const EMAIL_DOMAIN = "@office.hanseo.ac.kr";

export default function Pwfind() {
  const navigate = useNavigate();
  const goToPwcode = () => {
    navigate("/pwcode");  // ✅ 비밀번호 찾기 페이지로 이동
  };
  // --- form states
  const [emailId, setEmailId] = useState("");

  // --- validation
  const emailIdValid = useMemo(() => /^[0-9]{9}$/i.test(emailId), [emailId]);
  const hasTouched = {
    email: emailId.length > 0,
  };

  const formValid = emailIdValid

  // --- submit (연동 부분만 바꾸면 됨)
  const onSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;
    const email = `${emailId}${EMAIL_DOMAIN}`;
    // TODO: 실제 API 연동
    // await api.post("/auth/pw-reset-request", { email })
    alert(`비밀번호 재설정 코드 요청\nemail: ${email}`);
    goToPwcode();
  };

  return (
    <div className="pwfind">
      <header className="pwfind-header">
        <button className="back-btn" type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>〈</button>
        <h1 className="title">비밀번호 찾기</h1>
        <p className="subtitle">이메일을 입력하고 비밀번호 재설정 코드를 받으세요</p>
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
              placeholder="아이디 입력"
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
          이메일로 코드 받기
        </button>
      </form>
    </div>
  );
}

