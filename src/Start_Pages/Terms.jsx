import "./Terms.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export default function Terms() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const from = state?.from; // "school-email" 이 들어옴 (선택)

  const [agree1, setAgree1] = useState(false); // 이용약관(필수)
  const [agree2, setAgree2] = useState(false); // 개인정보 수집·이용(필수)
  const [agree3, setAgree3] = useState(false); // 위치기반서비스(필수)
  const allChecked = useMemo(() => agree1 && agree2 && agree3, [agree1, agree2, agree3]);

  const toggleAll = () => {
    const next = !(agree1 && agree2 && agree3);
    setAgree1(next); setAgree2(next); setAgree3(next);
  };

  const onSubmit = () => {
    if (!allChecked) return;
    // 다음 단계로 이동 (예: 학교 이메일 입력 화면)
    navigate("/signup", { state: { from } });
  };

  return (
    <main className="terms">
      <section className="hero">
        <h1>가장 안전하고, 스마트한,<br/>동행의 시작!</h1>
      </section>

      <section className="terms-card">
        <label className="row all" onClick={toggleAll}>
          <input type="checkbox" readOnly checked={allChecked} />
          <span><strong>모두 동의</strong></span>
        </label>

        <hr/>

        <label className="row">
          <input type="checkbox" checked={agree1} onChange={e=>setAgree1(e.target.checked)} />
          <span><strong>(필수)</strong> 이용약관</span>
          <button className="link" onClick={()=>alert("이용약관 모달/페이지 연결")}>〉</button>
        </label>

        <label className="row">
          <input type="checkbox" checked={agree2} onChange={e=>setAgree2(e.target.checked)} />
          <span><strong>(필수)</strong> 개인정보수집 및 이용동의</span>
          <button className="link" onClick={()=>alert("개인정보 처리방침 보기")}>〉</button>
        </label>

        <label className="row">
          <input type="checkbox" checked={agree3} onChange={e=>setAgree3(e.target.checked)} />
          <span><strong>(필수)</strong> 위치기반서비스 이용약관</span>
          <button className="link" onClick={()=>alert("위치기반서비스 약관 보기")}>〉</button>
        </label>

        <button className="btn btn-primary" disabled={!allChecked} onClick={onSubmit}>
          계속하기
        </button>
      </section>
    </main>
  );
}
