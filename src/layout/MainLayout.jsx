import React from 'react';
import { Outlet, useLocation } from "react-router-dom"; 
import { AnimatePresence, motion } from "framer-motion"; // 1. 라이브러리 추가
import BottomNav from "../objects/navigate";

export default function MainLayout() {
  // 2. 현재 경로(URL)를 알아내기 위해 사용 (이게 있어야 페이지 변경을 감지함)
  const location = useLocation();

  return (
    <>
      <main style={{ width: "100%", position: "relative", flex: 1, overflowX: "hidden" }}> 
        
        {/* 3. AnimatePresence: 컴포넌트가 사라질 때(exit) 애니메이션을 실행하게 해줌 */}
        {/* mode="wait": 이전 페이지가 완전히 사라진 후 다음 페이지가 나타남 (깔끔함) */}
        <AnimatePresence mode="wait">
          
          {/* 4. motion.div: 실제 애니메이션이 일어나는 박스 */}
          <motion.div
            key={location.pathname} // ★ 핵심: URL이 바뀔 때마다 이 키가 변해서 애니메이션이 다시 실행됨
            initial={{ opacity: 0, y: 20 }}     // 시작: 약간 아래에서 투명하게
            animate={{ opacity: 1, y: 0 }}      // 진행: 제자리로 오면서 불투명하게
            exit={{ opacity: 0, y: -20 }}       // 종료: 위로 사라지면서 투명하게
            transition={{ duration: 0.3 }}      // 0.3초 동안 부드럽게
            style={{ width: "100%", height: "100%" }}
          >
            
            <Outlet />

          </motion.div>

        </AnimatePresence>

      </main>

      <BottomNav />
    </>
  );
}