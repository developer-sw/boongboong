import React from "react";
import "./Service.css";
import { ReactComponent as Background } from "../pictures/background.svg";
import { ReactComponent as Copyment } from "../pictures/copyment.svg";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

export default function Service() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  // 1. 버튼 데이터를 배열로 관리합니다.
  const mainButtons = [
    {
      label: "학교 이메일로 가입하기",
      path: "/schoolsignup",
      className: "btn-primary",
    },
    {
      label: "로그인하기",
      path: "/signup",
      className: "btn-outline",
    },
  ];

  const goToPwFind = () => {
    navigate("/pwfind");
  };

  return (
    <main className="service">
      <section className="phone-frame">
        <div className="hero">
          <Copyment className="copy-svg" aria-label="신뢰를 달리는 BOONG BOONG" />
        </div>

        <Background className="bg-svg" aria-hidden="true" />

        <div className="cta">
          {/* 2. 배열을 .map()으로 순회하며 버튼을 동적으로 생성합니다. */}
          {mainButtons.map((button) => (
            <button
              key={button.path}
              type="button"
              // 3. 클래스 이름을 동적으로 조합합니다.
              className={`btn ${button.className} ${isMobile ? "btn-lg" : "btn-md"}`}
              onClick={() => navigate(button.path)}
            >
              {button.label}
            </button>
          ))}

          <button type="button" className="text-link" onClick={goToPwFind}>
            비밀번호 찾기
          </button>
        </div>
      </section>
    </main>
  );
}

