// src/pages/CarRegisterPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Driverlicense/licenseRegisterPage.css";
import CarHeader from "./CarHeader";
import CarPhotoSection from "./CarPhotoSection";
import CarBasicInfoSection from "./CarBasicInfoSection";
import CarSubmitSection from "./CarSubmitSection";

// ✅ 수정됨: axios 직접 사용 대신, 만든 api 함수 임포트
import { uploadCarImage, registerOrUpdateCar } from "../../api/carApi";

function CarRegisterPage() {
  const navigate = useNavigate();

  // 1. 상태 관리 (차량 정보 + 이미지)
  const [carInfo, setCarInfo] = useState({
    number: "",
    seats: "",
    color: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null); // 화면 표시용 미리보기
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // 서버 전송용 URL

  // 하단 네비게이션 숨기기
  useEffect(() => {
    document.body.classList.add("hide-bottom-nav");
    const styleEl = document.createElement("style");
    styleEl.id = "__hide_bottom_nav_car";
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
      document.getElementById("__hide_bottom_nav_car")?.remove();
    };
  }, []);

  // 2. 입력값 변경 핸들러
  const handleInfoChange = (e) => {
    const { id, value } = e.target;
    // id 매핑 (UI id -> state key)
    let key = id;
    if (id === "car-number") key = "number";
    if (id === "car-seat") key = "seats";
    if (id === "car-color") key = "color";

    setCarInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 3. 이미지 업로드 (API 함수 사용)
  const handleImageUpload = async (file) => {
    if (!file) return;

    // 사용자 경험을 위해 로컬 미리보기 즉시 설정
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // ✅ 수정됨: carApi의 함수 사용 (토큰 자동 포함)
      const serverImageUrl = await uploadCarImage(file);
      
      console.log("이미지 업로드 성공:", serverImageUrl);
      setUploadedImageUrl(serverImageUrl);

    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 4. 차량 정보 등록 (API 함수 사용)
  const handleSubmit = async () => {
    // 유효성 검사
    if (!carInfo.number) {
      alert("차량 번호를 입력해주세요.");
      return;
    }
    if (!uploadedImageUrl) {
      alert("차량 사진을 등록해주세요.");
      return;
    }

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    try {
      // ✅ 수정됨: carApi의 함수 사용 (토큰 자동 포함)
      await registerOrUpdateCar(
        userEmail,
        carInfo.number,
        uploadedImageUrl,
        carInfo.seats,
        carInfo.color
      );

      alert("차량 정보가 성공적으로 등록되었습니다!");
      navigate(-1); // 성공 후 뒤로가기

    } catch (error) {
      console.error("차량 등록 실패:", error);
      alert("차량 등록에 실패했습니다.");
    }
  };

  return (
    <div className="license-page">
      <CarHeader />

      <main className="license-main">
        {/* 안내 박스 */}
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

        {/* 🚗 차량 사진 등록 */}
        <CarPhotoSection 
          onFileSelect={handleImageUpload} 
          previewUrl={previewUrl} 
        />

        {/* 📝 차량 기본 정보 */}
        <CarBasicInfoSection 
          info={carInfo} 
          onChange={handleInfoChange} 
        />

        {/* 주의사항 박스 */}
        <section className="license-warning license-warning--car">
          <div className="license-warning-icon">
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

        {/* ✅ 등록 버튼 */}
        <CarSubmitSection onSubmit={handleSubmit} />
      </main>
    </div>
  );
}

export default CarRegisterPage;