import React, { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
// ✅ 방금 만든 파일(authAPI)을 불러옵니다.
import { authApi } from '../api/authApi';
import "./Signup.css"; 
import { ReactComponent as LogoSvg } from "../assets/login_title.svg"; 
import { ReactComponent as BackgroundSvg } from "../assets/login_bk.svg";

const EMAIL_DOMAIN = "@office.hanseo.ac.kr";

export default function Login() {
  const navigate = useNavigate();
  const goToPwfind = () => navigate("/pwfind"); 
  
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const emailIdValid = useMemo(() => /^[0-9]{9}$/i.test(emailId), [emailId]);
  const pwValid = useMemo(() => password.length >= 8, [password]);
  const hasTouched = { email: emailId.length > 0, pw: password.length > 0 };
  const formValid = emailIdValid && pwValid;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    const fullEmail = `${emailId}${EMAIL_DOMAIN}`;

    try {
      // ✅ 이렇게 딱 한 줄로 로그인이 끝납니다! 깔끔하죠?
      const response = await authApi.login(fullEmail, password);

      console.log("로그인 성공:", response);
      
      const token = response.data.token || response.data.accessToken; 
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      localStorage.setItem('email', fullEmail);
      alert("로그인 성공!");
      navigate("/main"); 

    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="login-container">
      <header className="login-header-new">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>〈</button>
      </header>
      <LogoSvg className="login-logo" />
      
      <form className="login-form" onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <div className="label-row">
            <label className="label">아이디 (이메일)</label>
            {hasTouched.email && !emailIdValid && <span className="error-msg">학번 확인 필요</span>}
          </div>
          <div className={`input-with-suffix ${hasTouched.email && !emailIdValid ? "invalid" : ""}`}>
            <input 
              type="text" 
              placeholder="학번 입력" 
              value={emailId} 
              onChange={(e) => setEmailId(e.target.value)} 
            />
            <span className="suffix">{EMAIL_DOMAIN}</span>
          </div>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label className="label">비밀번호</label>
            {hasTouched.pw && !pwValid && <span className="error-msg">8자리 이상</span>}
          </div>
          <div className={`password-field ${hasTouched.pw && !pwValid ? "invalid" : ""}`}>
            <input 
              type="password" 
              placeholder="비밀번호" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="login-actions">
          <button className="btn-primary" type="submit" disabled={!formValid}>
            로그인하기
          </button>
          <button type="button" className="link-btn" onClick={goToPwfind}>
            비밀번호 찾기
          </button>
        </div>
      </form>

      <div className="login-background">
        <BackgroundSvg />
      </div>
    </div>
  );
}