import React from "react";
import "./Splash.css";
import { ReactComponent as BoongLogo } from "../pictures/boongboong.svg";
import { useMediaQuery } from "react-responsive";

export default function Splash() {
  // 뷰포트 크기에 따른 조건
  const isMobile = useMediaQuery({ maxWidth: 767 }); // 767px 이하 = 모바일
  const isTabletOrDesktop = useMediaQuery({ minWidth: 768 });

  return (
    <main className="splash">
      <div className="safe">
        {isMobile && (
          <BoongLogo
            className="brand-svg"
            style={{ width: "70%", maxWidth: "320px" }}
            aria-label="BOONG BOONG"
          />
        )}
        {isTabletOrDesktop && (
          <BoongLogo
            className="brand-svg"
            style={{ width: "40%", maxWidth: "520px" }}
            aria-label="BOONG BOONG"
          />
        )}
      </div>
    </main>
  );
}
