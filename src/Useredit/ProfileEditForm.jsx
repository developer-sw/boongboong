// src/components/ProfileEditForm.jsx
import React, { useState, useEffect } from "react";
import "./profileEditForm.css";
import profilePhotoPlaceholder from "../assets/profile-photo-placeholder.svg";

function ProfileEditForm({
  initialProfile = {
    nickname: "",
    name: "",
    age: "",
  },
  onChangeProfile,
  onCheckNickname, // ✅ 부모에게서 전달받은 함수
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [isAgeOpen, setIsAgeOpen] = useState(false);

  // 부모의 초기값이 바뀌면(API 로딩 후 등) 상태 동기화
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleChange = (field) => (e) => {
    const next = { ...profile, [field]: e.target.value };
    setProfile(next);
    if (onChangeProfile) onChangeProfile(next);
  };

  const handleFocusPlaceholder = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlurPlaceholder = (e) => {
    if (!e.target.value) {
      e.target.placeholder = e.target.dataset.placeholder || "";
    }
  };

  const handlePhotoClick = () => {
    console.log("프로필 사진 변경 클릭");
  };

  // 나이 드롭다운 (18~60)
  const ageOptions = Array.from({ length: 43 }, (_, i) => 18 + i);

  const toggleAgeDropdown = () => {
    setIsAgeOpen((prev) => !prev);
  };

  const handleSelectAge = (age) => {
    const next = { ...profile, age: String(age) };
    setProfile(next);
    if (onChangeProfile) onChangeProfile(next);
    setIsAgeOpen(false);
  };

  // ✅ 중복확인 버튼 클릭 시 실행
  const handleDupCheck = () => {
    if (onCheckNickname) {
      onCheckNickname(profile.nickname);
    }
  };

  return (
    <section className="profile-edit-form">
      <div className="profile-edit-form-inner">
        {/* 0. 프로필 사진 */}
        <button
          type="button"
          className="profile-edit-photo-button"
          onClick={handlePhotoClick}
        >
          <img
            src={profilePhotoPlaceholder}
            alt="프로필 사진 등록"
            className="profile-edit-photo-img"
          />
        </button>

        {/* 1. 섹션 타이틀 */}
        <h2 className="profile-edit-section-title">프로필 수정하기</h2>

        {/* 2. 닉네임 + 중복확인 */}
        <div className="profile-edit-nickname-row">
          <div className="profile-edit-field profile-edit-nickname-field">
            <label className="profile-edit-label">닉네임</label>
            <input
              type="text"
              className="profile-edit-input profile-edit-input-nickname"
              placeholder="닉네임을 입력해주세요"
              value={profile.nickname || ""}
              onChange={handleChange("nickname")}
              onFocus={handleFocusPlaceholder}
              onBlur={handleBlurPlaceholder}
            />
          </div>

          <button
            type="button"
            className="profile-edit-dupcheck-button"
            onClick={handleDupCheck} // ✅ 핸들러 연결
          >
            중복확인
          </button>
        </div>

        {/* 3. 이름 + 나이 */}
        <div className="profile-edit-name-age-row">
          {/* 이름 */}
          <div className="profile-edit-field profile-edit-name-field">
            <label className="profile-edit-label">이름</label>
            <input
              type="text"
              className="profile-edit-input profile-edit-input-name"
              placeholder="이름 입력"
              value={profile.name || ""}
              onChange={handleChange("name")}
              onFocus={handleFocusPlaceholder}
              onBlur={handleBlurPlaceholder}
            />
          </div>

          {/* 나이 드롭다운 */}
          <div className="profile-edit-field profile-edit-age-field">
            <label className="profile-edit-label">나이</label>
            <div className="profile-edit-age-wrapper">
              <button
                type="button"
                className="profile-edit-age-trigger"
                onClick={toggleAgeDropdown}
              >
                <span className="profile-edit-age-value">
                  {profile.age ? `${profile.age}` : "선택"}
                </span>
                <span className="profile-edit-age-arrow">▼</span>
              </button>

              {isAgeOpen && (
                <div className="profile-edit-age-dropdown">
                  {ageOptions.map((age) => (
                    <button
                      key={age}
                      type="button"
                      className="profile-edit-age-option"
                      onClick={() => handleSelectAge(age)}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileEditForm;