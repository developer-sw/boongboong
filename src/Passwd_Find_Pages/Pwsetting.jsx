import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../api/authApi"; 
import "./Pwsetting.css";

export default function Pwsetting() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!email) {
      alert("세션이 만료되었거나 잘못된 접근입니다.");
      navigate("/pwfind");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 유효성 검사
    if (!password || !confirmPassword) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    // ✅ 특수문자/영문/숫자 조합 검사 정규식 추가
    // (영문, 숫자, 특수문자 각각 최소 1개 이상 포함, 8자 이상)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,64}$/;

    if (!passwordRegex.test(password)) {
      setError("비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ 수정된 authApi 호출 (인자 3개 전달)
      await authApi.resetPassword(email, password, confirmPassword);
      
      alert("비밀번호가 성공적으로 변경되었습니다.");
      
      // ✅ 수정됨: 로그인 페이지("/login") 대신 홈("/")으로 이동
      navigate("/");

    } catch (err) {
      console.error("비밀번호 변경 실패:", err);
      
      if (err.response && err.response.data && err.response.data.details) {
         // 서버에서 온 상세 에러 메시지 처리
         const details = err.response.data.details;
         if (details.newPassword) setError(details.newPassword);
         else if (details.confirmPassword) setError(details.confirmPassword);
         else if (details.passwordConfirmed) setError(details.passwordConfirmed);
         else setError("입력값을 확인해주세요.");
      } else if (err.response && err.response.data && err.response.data.message) {
         setError(err.response.data.message);
      } else {
         setError("비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pwsetting">
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
        〈
      </button>

      <h1 className="title">비밀번호 재설정</h1>
      <p className="subtitle">영문, 숫자, 특수문자(!@#$ 등)를 포함해 8자 이상 입력해주세요.</p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">새 비밀번호</label>
          <input
            type="password"
            className="control"
            placeholder="영문/숫자/특수문자 포함 8자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label className="label">새 비밀번호 확인</label>
          <input
            type="password"
            className="control"
            placeholder="한 번 더 입력"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn primary submit" disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "비밀번호 변경 완료"}
        </button>
      </form>
    </main>
  );
}