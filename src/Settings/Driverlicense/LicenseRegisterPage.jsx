// src/pages/LicenseRegisterPage.jsx
// 'useState'를 사용하기 위해 React에서 import 합니다.
import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 임포트
import "./licenseRegisterPage.css";
import LicenseHeader from "./LicenseHeader";
import LicenseInfoSection from "./LicenseInfoSection";
import LicensePersonalSection from "./LicensePersonalSection";
import LicenseSubmitSection from "./LicenseSubmitSection";

// 임시 API 함수 정의 (실제 API 파일이 없는 경우를 대비)
const registerLicense = async (email, licenseData) => {
    console.log("API 호출: 운전면허증 등록 시도");
    console.log("Email:", email);
    console.log("Data:", licenseData);
    return new Promise((resolve, reject) => { // reject 추가
        setTimeout(() => {
            if (licenseData.licenseNumber && licenseData.name) {
                resolve({ success: true, message: "등록 성공" });
            } else {
                reject(new Error("필수 정보 누락")); // 실패 시 reject 호출
            }
        }, 1000);
    });
};


function LicenseRegisterPage() {
  // ✅ useNavigate 훅 초기화
  const navigate = useNavigate(); 
    
  // 1. 모든 입력 필드의 상태 통합
  const [formData, setFormData] = useState({
    licenseNumber: '',
    licenseType: '',
    issuedAt: '',
    expiresAt: '',
    name: '',
    birthDate: '',
    address: '',
  });

  // 2. 입력 필드 변경 핸들러
  const handleChange = (e) => {
    // id가 없는 경우, name 속성을 사용하여 상태를 업데이트합니다.
    const key = e.target.id || e.target.name; 
    const { value } = e.target;
    
    // LicensePersonalSection의 input에는 id가 없으므로 name을 사용하여 업데이트되도록 보장합니다.
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // 3. 폼 제출 핸들러 (API 호출)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⚠️ 실제 로그인된 사용자 이메일로 대체해야 합니다!
    const userEmail = "202100048@office.hanseo.ac.kr"; 

    // 간단한 유효성 검사 (필수 항목 체크)
    const requiredFields = ['licenseNumber', 'name', 'birthDate'];
    const isFormValid = requiredFields.every(field => formData[field].trim() !== '');

    if (!isFormValid) {
        alert("필수 항목(면허증 번호, 이름, 생년월일 등)을 모두 입력해 주세요.");
        return;
    }
    
    try {
      // registerLicense API 호출
      const result = await registerLicense(userEmail, formData); 
      console.log("등록 성공 응답:", result);
      alert("운전면허증 등록이 완료되었습니다.");
      
      // ✅ 수정된 부분: 성공 후 이전 페이지로 이동 
      navigate(-1); 

    } catch (error) {
      console.error("운전면허증 등록 실패:", error);
      alert(`운전면허증 등록에 실패했습니다. (${error.message || '서버 오류'})`);
    }
  };

  // 하단 네비게이션 숨김/복원 로직 (기존 코드 유지)
  useEffect(() => {
    document.body.classList.add("hide-bottom-nav");

    const styleEl = document.createElement("style");
    styleEl.id = "__hide_bottom_nav_license";
    styleEl.textContent = `
      body.hide-bottom-nav nav,
      body.hide-bottom-nav [role="navigation"],
      body.hide-bottom-nav .bb-bottomnav,
      body.hide-bottom-nav .bottom-nav,
      body.hide-bottom-nav .app-bottom-nav,
      body.hide-bottom-nav #bottomNav,
      body.hide-bottom-nav .BottomNav,
      body.hide-bottom-nav [class*="bottom-nav"],
      body.hide-bottom-nav [class*="BottomNav"],
      body.hide-bottom-nav [class*="bottomNav"],
      body.hide-bottom-nav footer.bottom-nav {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.body.classList.remove("hide-bottom-nav");
      document.getElementById("__hide_bottom_nav_license")?.remove();
    };
  }, []);

  return (
    <div className="license-page">
      {/* 상단 운전면허증 등록 헤더 */}
      <LicenseHeader />

      <main className="license-main">
        {/* 안전한 카풀을 위한 필수인증 안내 박스 */}
        <div className="license-info-card">
          <div className="license-info-icon">
            <span className="license-info-icon-text">i</span>
          </div>

          <div className="license-info-texts">
            <p className="license-info-title">안전한 카풀을 위한 필수인증</p>
            <p className="license-info-desc">
              운전면허증 정보는 안전하게 암호화되어 저장되며,
              <br />
              카풀 매칭 시에만 사용됩니다.
            </p>
          </div>
        </div>

        {/* 면허증 정보 섹션 - props 전달 */}
        <LicenseInfoSection formData={formData} handleChange={handleChange} />

        {/* 개인정보 섹션 - props 전달 */}
        <LicensePersonalSection formData={formData} handleChange={handleChange} />

        {/* 주의사항 박스 */}
        <section className="license-warning">
          <div className="license-warning-icon">
            {/* 삼각형 안의 느낌표 */}
            <span className="license-warning-icon-mark">!</span>
          </div>
          <div className="license-warning-texts">
            <p className="license-warning-title">주의사항</p>
            <ul className="license-warning-list">
              <li>면허증 정보는 실제 정보와 일치해야 합니다.</li>
              <li>허위 정보 입력 시 서비스 이용이 제한될 수 있습니다.</li>
              <li>만료된 면허증은 등록할 수 없습니다.</li>
              <li>사진은 선명하게 촬영해 주세요.</li>
            </ul>
          </div>
        </section>

        {/* 하단 "운전면허증 등록하기" 버튼 섹션 - handleSubmit 함수 전달 */}
        <LicenseSubmitSection handleSubmit={handleSubmit} />
      </main>
    </div>
  );
}

export default LicenseRegisterPage;