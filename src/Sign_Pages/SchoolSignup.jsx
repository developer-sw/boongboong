// src/pages/SchoolSignup.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolSignup.css";

const EMAIL_DOMAIN = "@office.hanseo.ac.kr";
const CODE_SECONDS = 180; // 3분

export default function SchoolSignup() {
    const navigate = useNavigate(); 
    const goToTerms = () => {
      navigate("/terms");  // ✅ 약관 페이지 경로로 이동
    };

  // ====== 폼 상태 ======
  const [emailId, setEmailId] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // ====== UI/검증 상태 ======
  const [sendingCode, setSendingCode] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [nickChecked, setNickChecked] = useState(false);
  const [nickTried, setNickTried] = useState(false); // 중복확인 시도 여부

  const [codeExpireAt, setCodeExpireAt] = useState(null); // Date | null
  const [secondsLeft, setSecondsLeft] = useState(0);

  // 이메일, PW 기본 검증
  const emailIdValid = useMemo(
    () => /^[0-9]{9}$/.test(emailId),
    [emailId]
  );
  const pwValid = password.length >= 8;

  const canSendCode = emailIdValid && !sendingCode;
  const emailError = emailId && !emailIdValid;
  const pwError = password && !pwValid;
  const nickError = nickTried && !nickChecked;

  const canSubmit = useMemo(
    () =>
      emailVerified &&
      pwValid &&
      nickname.trim().length > 0 &&
      nickChecked &&
      name.trim().length > 0 &&
      !!age,
    [emailVerified, pwValid, nickname, nickChecked, name, age]
  );

  // ====== 타이머 ======
  useEffect(() => {
    if (!codeExpireAt) {
      setSecondsLeft(0);
      return;
    }
    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((codeExpireAt - now) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        setEmailVerified(false);
      }
    };
    tick();
    const t = setInterval(tick, 500);
    return () => clearInterval(t);
  }, [codeExpireAt]);

  const mmss = (total) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ====== 이벤트 핸들러 (API 연동 지점 표시) ======
  const handleSendCode = async () => {
    if (!canSendCode) return;
    setSendingCode(true);
    try {
      // await api.post("/auth/send-code", { email: emailId + EMAIL_DOMAIN });
      setCodeExpireAt(Date.now() + CODE_SECONDS * 1000);
      alert("인증번호를 보냈습니다(데모). 메일함을 확인해주세요.");
    } catch (e) {
      alert("인증번호 요청 실패(데모).");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    if (secondsLeft === 0) {
      alert("인증 유효시간이 만료되었습니다. 다시 요청해주세요.");
      return;
    }
    try {
      // await api.post("/auth/verify-code", { email: emailId + EMAIL_DOMAIN, code });
      setEmailVerified(true);
      setCodeExpireAt(null);
      alert("이메일 인증 완료(데모).");
    } catch (e) {
      setEmailVerified(false);
      alert("인증 실패(데모).");
    }
  };

  const handleCheckNickname = async () => {
    setNickTried(true);
    if (!nickname.trim()) return;
    try {
      // const { data } = await api.get(`/users/nickname-check?nick=${nickname}`);
      // if (data.ok) setNickChecked(true); else setNickChecked(false);
      // 데모용: 닉네임이 "봉봉이"면 중복이라고 가정
      const duplicated = nickname.trim() === "봉봉이";
      setNickChecked(!duplicated);
    } catch (e) {
      setNickChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      // await api.post("/auth/signup", {
      //   email: emailId + EMAIL_DOMAIN, password, nickname, name, age
      // });
      alert("가입이 완료되었습니다(데모).");
      navigate("/login");
    } catch (e) {
      alert("가입 실패(데모).");
    }
  };

  return (
    <main className="schoolsignup">
      <button className="icon-back" onClick={() => navigate(-1)} aria-label="Back">
        〈
      </button>

      {/* 제목 + 라벨 설명 */}
      <h1 className="title">학교 이메일로 가입하기</h1>
      <p className="subtitle">인증번호가 오지 않았다면 정크 메일함을 확인하세요.</p>

      <form className="card" onSubmit={handleSubmit}>
        {/* ===== 아이디(이메일) ===== */}
        <div className="label-row">
          <label className="label">아이디 (이메일)</label>
          {emailError && (
            <span className="label-help error">학번 9자리를 입력해주세요</span>
          )}
        </div>

        <div className="input-row is-email">
          <div className="input-with-suffix">
            <input
              type="text"
              className={`control ${emailError ? "invalid" : ""}`}
              placeholder="아이디 입력"
              value={emailId}
              onChange={(e) => {
                setEmailId(e.target.value);
                setEmailVerified(false);
              }}
              inputMode="email"
              autoComplete="username"
            />
            <span className="suffix">{EMAIL_DOMAIN}</span>
          </div>
          <button
            type="button"
            className="btn ghost dark"
            onClick={handleSendCode}
            disabled={!canSendCode}
          >
            {sendingCode ? "전송중…" : "인증요청"}
          </button>
        </div>

        {/* ===== 인증번호 ===== */}
        <div className="input-row is-code">
          <div className="code-input-wrap">
            <input
              type="text"
              className="control"
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setEmailVerified(false);
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            {/* 우측 타이머 */}
            {secondsLeft > 0 && (
              <span className="code-timer">{mmss(secondsLeft)}</span>
            )}
          </div>

          <button
            type="button"
            className={`btn ghost dark ${emailVerified ? "ok" : ""}`}
            onClick={handleVerifyCode}
            disabled={!code.trim()}
          >
            {emailVerified ? "인증완료" : "확인"}
          </button>
        </div>

        {/* ===== 비밀번호 ===== */}
        <div className="label-row">
          <label className="label">비밀번호</label>
          {pwError && (
            <span className="label-help error">비밀번호는 8자 이상이어야 합니다</span>
          )}
        </div>
        <input
          type="password"
          className={`control ${pwError ? "invalid" : ""}`}
          placeholder="8자 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/* ===== 닉네임 ===== */}
        <div className="label-row">
          <label className="label">닉네임</label>
          {nickError && (
            <span className="label-help error">중복된 닉네임입니다</span>
          )}
        </div>
        <div className="input-row">
          <input
            type="text"
            className={`control ${nickError ? "invalid" : ""}`}
            placeholder="ex) 봉봉이"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNickChecked(false);
              setNickTried(false);
            }}
          />
          <button
            type="button"
            className={`btn ghost dark ${nickChecked ? "ok" : ""}`}
            onClick={handleCheckNickname}
            disabled={!nickname.trim()}
          >
            중복확인
          </button>
        </div>

        {/* ===== 이름 / 나이 ===== */}
        <div className="grid-2">
          <div>
            <label className="label">이름</label>
            <input
              type="text"
              className="control"
              placeholder="ex) 김한서"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="label">나이</label>
            <div className="select-wrap">
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="control"
              >
                <option value="">선택</option>
                {Array.from({ length: 70 }, (_, i) => i + 18).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="chevron">▾</span>
            </div>
          </div>
        </div>

        {/* ===== 제출 버튼 ===== */}
        <button type="button" className="btn primary submit" onClick={goToTerms}>
          계속하기
        </button>
      </form>
    </main>
  );
}
