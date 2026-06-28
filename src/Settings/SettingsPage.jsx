// src/pages/SettingsPage.jsx

// 1. 상태(useState) 및 라이프사이클 훅(useEffect) 임포트
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./settingsPage.css";
import SettingsHeader from "./SettingsHeader";
import MyVerificationSection from "./MyVerificationSection";
import SettingsAccountSection from "./SettingsAccountSection";

// 2. 작성해두신 authApi 가져오기 (경로는 실제 파일 위치에 맞게 조정해주세요)
import { authApi } from "../api/authApi"; 
// import { fetchLicenseStatus } from "../api/mypageApi"; // ⚠️ 실제 API 임포트로 대체하세요.

// 🌟 임시 운전면허 상태 조회 API 함수 (실제 API로 대체하세요!)
// 이 함수는 서버에 GET 요청을 보내 현재 인증 상태를 받아와야 합니다.
const fetchLicenseStatus = async (email) => {
    console.log(`API 호출 시도: ${email}의 운전면허 상태 조회`);
    
    // 이 예시에서는 로컬 스토리지를 사용하여 상태를 시뮬레이션합니다.
    const status = localStorage.getItem('currentLicenseStatus');
    
    return new Promise(resolve => {
        setTimeout(() => {
            if (status === 'verified') {
                resolve('verified'); // 초록색 "인증완료"
            } else if (status === 'pending') {
                resolve('pending'); // 주황색 "인증 대기중"
            } else {
                resolve('unverified'); // 빨간색 "미인증"
            }
        }, 300); // 네트워크 지연 시뮬레이션
    });
};


function SettingsPage() {
  const navigate = useNavigate(); 
  
  // 3. 운전면허 상태를 저장할 state 정의
  const [licenseStatus, setLicenseStatus] = useState("unverified"); 
  
  // ⚠️ 실제 로그인된 사용자 이메일을 가져오는 로직으로 대체해야 합니다.
  const userEmail = localStorage.getItem('userEmail') || "unknown@user.com"; 

  // 4. 컴포넌트가 처음 로드될 때 인증 상태를 조회하는 로직
  useEffect(() => {
      const getStatus = async () => {
          try {
              // 서버에서 최신 상태를 불러옵니다.
              const status = await fetchLicenseStatus(userEmail); 
              setLicenseStatus(status);
          } catch (error) {
              console.error("인증 상태 조회 실패:", error);
              setLicenseStatus("unverified"); // 에러 발생 시 미인증으로 처리
          }
      };
      // 함수 호출
      getStatus();
  }, [userEmail]); // userEmail이 변경되면 재실행

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.clear(); 
      alert("로그아웃 되었습니다.");
      navigate("/"); 

    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
      localStorage.clear();
      navigate("/");
    }
  };

  const handleWithdraw = () => {
    console.log("TODO: 회원탈퇴 API 호출");
  };

  return (
    <div className="settings-screen">
      <SettingsHeader />
      {/* 5. 동적으로 가져온 상태를 prop으로 전달 */}
      <MyVerificationSection licenseStatus={licenseStatus} /> 
      
      <SettingsAccountSection
        onLogout={handleLogout}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
}

export default SettingsPage;