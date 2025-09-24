// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./Start_Pages/Splash";
import Service from "./Start_Pages/Service";
import Terms from "./Start_Pages/Terms"; 
import SchoolSignup from "./Sign_Pages/SchoolSignup";
import Signup from "./Sign_Pages/Signup";
import Pwfind from "./Passwd_Find_Pages/Pwfind";
import Pwcode from "./Passwd_Find_Pages/Pwcode";
import Pwsetting from "./Passwd_Find_Pages/Pwsetting";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2000); // 2초 스플래시
    return () => clearTimeout(t);
  }, []);

  // 스플래시는 라우터 밖에서 단독 표시
  if (showSplash) return <Splash />;

  // 스플래시 끝난 뒤 라우팅 시작
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Service />} />
        <Route path="/schoolsignup" element={<SchoolSignup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pwfind" element={<Pwfind />} />
        <Route path="/pwcode" element={<Pwcode />} />
        <Route path="/pwsetting" element={<Pwsetting />} />
      </Routes>
    </BrowserRouter>
  );
}
