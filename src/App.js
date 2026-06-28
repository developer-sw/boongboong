import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// [수정됨] 경로 변경: components 폴더 제거 -> 현재 위치에서 import
import NotificationHandler from './NotificationHandler'; 

// 레이아웃 컴포넌트
import MainLayout from "./layout/MainLayout";

// 시작 및 회원가입 관련 페이지
import Splash from "./Start_Pages/Splash";
import Service from "./Start_Pages/Service";
import Terms from "./Start_Pages/Terms";
import SchoolSignup from "./Sign_Pages/SchoolSignup";
import Signup from "./Sign_Pages/Signup";
import Pwfind from "./Passwd_Find_Pages/Pwfind";
import Pwcode from "./Passwd_Find_Pages/Pwcode";
import Pwsetting from "./Passwd_Find_Pages/Pwsetting";
import WritePage from "./Write_pages/writepage";
import Detail from "./CardDetail/detail";
import OpenChatRegisterPage from "./Kakao/openchatregisterpage";
import SettingsPage from './Settings/SettingsPage';
import ProfileEditPage from './Useredit/ProfileEditPage';
import LicenseRegisterPage from './Settings/Driverlicense/LicenseRegisterPage';
import CarRegisterPage from './Settings/Carinfo/CarRegisterPage';

// 리뷰 페이지 import
import ReviewPage from "./Review/review"; 

// 네비게이션 바가 필요한 '메인 페이지'들
import Main from "./Main_Pages/main"; 
import Search from "./Search_Pages/search";
import Carpool from "./My_Carpool/carpool";
import MyPage from "./My_Page/mypage"; 

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) return <Splash />;

  return (
    <BrowserRouter>
      {/* NotificationHandler 배치 
         (이제 App.js와 같은 폴더에 있는 파일을 불러옵니다)
      */}
      <NotificationHandler />

      <Routes>
        {/* ▼▼▼ 네비게이션 바가 없는 페이지들 ▼▼▼ */}
        <Route path="/" element={<Service />} />
        <Route path="/schoolsignup" element={<SchoolSignup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pwfind" element={<Pwfind />} />
        <Route path="/pwcode" element={<Pwcode />} />
        <Route path="/pwsetting" element={<Pwsetting />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/openchat-register" element={<OpenChatRegisterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/useredit" element={<ProfileEditPage />} />
        <Route path="/license-register" element={<LicenseRegisterPage />} />
        <Route path="/car-register" element={<CarRegisterPage />} />

        {/* 리뷰 작성 페이지 라우트 */}
        <Route path="/review" element={<ReviewPage />} />

        {/* ▼▼▼ 네비게이션 바가 필요한 페이지들 (그룹으로 묶기) ▼▼▼ */}
        <Route element={<MainLayout />}>
          <Route path="/main" element={<Main />} />
          <Route path="/search" element={<Search />} />
          <Route path="/carpool" element={<Carpool />} />
          <Route path="/me" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}