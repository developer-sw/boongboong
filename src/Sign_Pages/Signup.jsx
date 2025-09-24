import React, { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Signup.css";

const EMAIL_DOMAIN = "@office.hanseo.ac.kr";

export default function Login() {
  const navigate = useNavigate();
  const goToPwfind = () => {
    navigate("/pwfind"); // ✅ 비밀번호 찾기 페이지로 이동
  };
  const goToMain = () => {
    navigate("/main"); // ✅ 메인 페이지로 이동
  };
  // --- form states
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  // --- validation
  const emailIdValid = useMemo(() => /^[0-9]{9}$/i.test(emailId), [emailId]);
  const pwValid = useMemo(() => password.length >= 8, [password]);

  const hasTouched = {
    email: emailId.length > 0,
    pw: password.length > 0,
  };

  const formValid = emailIdValid && pwValid;

  // --- submit (연동 부분만 바꾸면 됨)
  const onSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;
    const email = `${emailId}${EMAIL_DOMAIN}`;
    // TODO: 실제 로그인 API 연동
    // await api.post("/auth/login", { email, password })
    alert(`로그인 시도\nemail: ${email}`);
  };

  return (
    <div className="signup">
      <header className="login-header">
        {/* [수정] onClick 이벤트 핸들러를 추가하여 뒤로가기 기능을 구현합니다. */}
        <button className="back-btn" type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>〈</button>
        <h1 className="title">로그인하기</h1>
        <p className="subtitle">봉봉에 오신걸 환영합니다!</p>
      </header>

      <form className="login-card" onSubmit={onSubmit} noValidate>
        {/* 이메일 */}
        <div className="form-group">
          <div className="label-row">
            <label className="label">아이디 (이메일)</label>
            {hasTouched.email && !emailIdValid && (
              <span className="error-msg">학번의 자릿수를 확인해주세요</span>
            )}
          </div>

          <div className={`input-with-suffix ${hasTouched.email && !emailIdValid ? "invalid" : ""}`}>
            <input
              type="text"
              placeholder="아이디 입력"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              inputMode="email"
              autoComplete="username"
            />
            <span className="suffix">{EMAIL_DOMAIN}</span>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <div className="label-row">
            <label className="label">비밀번호</label>
            {hasTouched.pw && !pwValid && (
              <span className="error-msg">비밀번호는 8자리 이상입니다</span>
            )}
          </div>

          <div className={`password-field ${hasTouched.pw && !pwValid ? "invalid" : ""}`}>
            <input
              type="password"
              placeholder="8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="button" className="link-btn" onClick={goToPwfind}>
            비밀번호 찾기
          </button>
        </div>

        <button className="btn-primary" type="submit" onClick={goToMain}>
          로그인하기
        </button>
      </form>
    </div>
  );
}

