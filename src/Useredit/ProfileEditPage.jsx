// src/pages/ProfileEditPage.jsx
import React, { useState, useEffect } from "react";
import "./profileEditPage.css";
import ProfileEditHeader from "./ProfileEditHeader";
import ProfileEditForm from "./ProfileEditForm";
import ProfileEditSaveBar from "./ProfileEditSaveBar";

// ✅ 작성하신 userApi에서 함수 임포트
import { checkNicknameDuplicate, updateNickname } from "../api/userApi";

function ProfileEditPage() {
  // 하단 네비 숨김 처리 (기존 코드 유지)
  useEffect(() => {
    document.body.classList.add("hide-bottom-nav");
    const styleEl = document.createElement("style");
    styleEl.id = "__hide_bottom_nav_profile_edit";
    styleEl.textContent = `
      body.hide-bottom-nav nav,
      body.hide-bottom-nav [role="navigation"],
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
      document.getElementById("__hide_bottom_nav_profile_edit")?.remove();
    };
  }, []);

  const [profile, setProfile] = useState({
    nickname: "",
    name: "",
    age: "",
    email: "", // API 호출 시 식별자로 필요하므로 추가
  });

  // ✅ 원래 닉네임 따로 저장할 state
  const [originalNickname, setOriginalNickname] = useState("");

  // 초기 데이터 로드 (로컬 스토리지 예시)
  useEffect(() => {
    const storedEmail =
      localStorage.getItem("userEmail") || "202100048@office.hanseo.ac.kr"; // 테스트용 기본값
    const storedNickname = localStorage.getItem("userNickname") || "";
    const storedName = localStorage.getItem("userName") || "";

    setProfile((prev) => ({
      ...prev,
      email: storedEmail,
      nickname: storedNickname,
      name: storedName,
    }));

    // ✅ 원래 닉네임 기억
    setOriginalNickname(storedNickname);
  }, []);

  const handleChangeProfile = (nextProfile) => {
    setProfile(nextProfile);
  };

  // ✅ 1. 닉네임 중복 확인 기능 (수정버전)
  const handleCheckNickname = async (nickname) => {
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    // ✅ "본인이 원래 쓰던 닉네임"과 같은지 비교해야 함
    if (nickname === originalNickname) {
      alert("현재 사용 중인 닉네임입니다.");
      return;
    }

    try {
      // userApi.js의 함수 호출 결과 받기
      const responseData = await checkNicknameDuplicate(nickname);

      console.log("중복 확인 API 응답값:", responseData);

      let isDuplicate;

      // 1) 응답이 boolean 인 경우
      if (typeof responseData === "boolean") {
        isDuplicate = responseData;
      }
      // 2) 응답이 문자열 "true"/"false" 인 경우
      else if (responseData === "true" || responseData === "false") {
        isDuplicate = responseData === "true";
      }
      // 3) 응답이 객체인 경우(예: { exists: true } 같은 형태)
      else if (typeof responseData === "object" && responseData !== null) {
        // 가장 흔한 패턴들을 커버 (필요하면 여기만 살짝 수정하면 됨)
        if ("exists" in responseData) {
          isDuplicate = responseData.exists;
        } else if ("data" in responseData) {
          isDuplicate = responseData.data;
        } else if ("result" in responseData) {
          isDuplicate = responseData.result;
        } else {
          // 모르겠으면 일단 콘솔 보고 형태 맞춰서 수정
          console.warn("닉네임 중복 API 응답 형태를 확인해주세요:", responseData);
          // 안전하게 '중복 아님'으로 처리
          isDuplicate = false;
        }
      } else {
        // 예상치 못한 타입이면 일단 중복 아님으로 처리
        isDuplicate = false;
      }

      if (isDuplicate) {
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        alert("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      console.error("중복 확인 에러:", error);
      if (error.response && error.response.status === 409) {
        alert("이미 사용 중인 닉네임입니다.");
      } else {
        alert("중복 확인 중 오류가 발생했습니다.");
      }
    }
  };

  // ✅ 2. 저장(수정) 기능
  const handleSave = async () => {
    try {
      await updateNickname(profile.email, profile.nickname);

      alert("프로필이 성공적으로 수정되었습니다.");

      // 수정된 닉네임 로컬 스토리지 업데이트
      localStorage.setItem("userNickname", profile.nickname);
      // ✅ 저장 후 originalNickname도 같이 업데이트 (다시 들어와도 일관되게)
      setOriginalNickname(profile.nickname);
    } catch (error) {
      console.error("프로필 수정 에러:", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="profile-edit-page">
      <ProfileEditHeader />

      {/* Form에 중복확인 함수(onCheckNickname)를 전달 */}
      <ProfileEditForm
        initialProfile={profile}
        onChangeProfile={handleChangeProfile}
        onCheckNickname={handleCheckNickname}
      />

      <ProfileEditSaveBar onSave={handleSave} />
    </div>
  );
}

export default ProfileEditPage;
