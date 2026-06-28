import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolSignup.css";

// userApi.js 파일 경로에 맞춰 import 경로를 수정해주세요.
import { 
  signup, 
  sendEmailVerification, 
  verifyEmailCode, 
  checkNicknameDuplicate 
} from "../api/userApi"; 

const EMAIL_DOMAIN = "@office.hanseo.ac.kr";
const CODE_SECONDS = 180; // 3분

export default function SchoolSignup() {
  const navigate = useNavigate();

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

  const [codeExpireAt, setCodeExpireAt] = useState(null);
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

  // ====== 타이머 로직 ======
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
        // 시간 만료 시 처리 로직 (필요시 추가)
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

  // ====== API 핸들러 (userApi.js 사용) ======

  // 1. 이메일 인증코드 전송
  const handleSendCode = async () => {
    if (!canSendCode) return;
    setSendingCode(true);

    const fullEmail = emailId + EMAIL_DOMAIN;

    try {
      await sendEmailVerification(fullEmail);
      
      setCodeExpireAt(Date.now() + CODE_SECONDS * 1000);
      alert("인증번호를 보냈습니다. 메일함을 확인해주세요.");
    } catch (error) {
      console.error("인증번호 전송 실패:", error);
      alert("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSendingCode(false);
    }
  };

  // 2. 인증코드 검증
  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    if (secondsLeft === 0 && codeExpireAt !== null) {
      alert("인증 유효시간이 만료되었습니다. 다시 요청해주세요.");
      return;
    }

    const fullEmail = emailId + EMAIL_DOMAIN;

    try {
      await verifyEmailCode(fullEmail, code);

      setEmailVerified(true);
      setCodeExpireAt(null); // 타이머 종료
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      console.error("인증 실패:", error);
      setEmailVerified(false);
      alert("인증번호가 일치하지 않거나 오류가 발생했습니다.");
    }
  };

  // 3. 닉네임 중복 확인 (✅ 수정된 부분)
  const handleCheckNickname = async () => {
    setNickTried(true);
    if (!nickname.trim()) return;

    try {
      const response = await checkNicknameDuplicate(nickname);
      
      // 디버깅용 로그: F12 콘솔에서 서버가 뭐라고 주는지 확인 가능
      console.log("닉네임 중복 확인 응답값:", response); 
      console.log("응답 타입:", typeof response);

      // ✅ 핵심 수정: 문자열 "true"/"false"와 Boolean true/false를 모두 커버
      const isDuplicate = String(response) === "true";

      if (isDuplicate) {
        setNickChecked(false);
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        setNickChecked(true);
        alert("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 확인 오류:", error);
      setNickChecked(false);
      alert("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 4. 회원가입 완료
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const fullEmail = emailId + EMAIL_DOMAIN;
    const signupData = {
      email: fullEmail,
      password: password,
      name: name,
      nickname: nickname,
      age: Number(age),
    };

    try {
      await signup(signupData);

      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
    }
  };

  return (
    <main className="schoolsignup">
      <button className="icon-back" onClick={() => navigate(-1)} aria-label="Back">
        〈
      </button>

      <h1 className="title">학교 이메일로 가입하기</h1>
      <p className="subtitle">인증번호가 오지 않았다면 정크 메일함을 확인하세요.</p>

      <form className="card" onSubmit={handleSubmit}>
        {/* ===== 아이디(이메일) ===== */}
        <div className="label-row">
          <label className="label">아이디 (이메일)</label>
          {emailError && (
            <span className="label-help msg-error">학번 9자리를 입력해주세요</span>
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
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
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
            <span className="label-help msg-error">비밀번호는 8자 이상이어야 합니다</span>
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
            <span className="label-help msg-error">중복된 닉네임입니다</span>
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
        <button 
            type="submit" 
            className="btn primary submit" 
            disabled={!canSubmit}
        >
          회원가입 완료
        </button>
      </form>
    </main>
  );
}