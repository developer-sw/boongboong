// src/components/CarPhotoSection.jsx
import React, { useRef } from "react";
import "./carPhotoSection.css";
import carPhotoPlaceholder from "../../assets/DIV-44.svg";

// onFileSelect: 파일을 선택했을 때 실행할 부모 함수
// previewUrl: 부모가 관리하는 미리보기 URL
function CarPhotoSection({ onFileSelect, previewUrl }) {
  const fileInputRef = useRef(null);

  // 박스 클릭 -> 숨겨진 input click 트리거
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 시 부모에게 파일 전달
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <section className="car-photo-section">
      <h2 className="car-photo-title">차량 사진 등록</h2>
      <p className="car-photo-subtitle">차량 외관 사진</p>

      {/* 숨겨진 파일 인풋 */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* 클릭 가능한 영역 */}
      <button
        type="button"
        className="car-photo-box"
        onClick={handleClick}
        aria-label="차량 사진 업로드"
      >
        <img
          // previewUrl이 있으면 그걸 보여주고, 없으면 기본 아이콘 보여줌
          src={previewUrl || carPhotoPlaceholder}
          alt="차량 사진"
          className={previewUrl ? "car-photo-preview" : "car-photo-placeholder"}
          style={previewUrl ? { width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" } : {}}
        />
      </button>
    </section>
  );
}

export default CarPhotoSection;