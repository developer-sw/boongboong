// src/components/CarSubmitSection.jsx
import React from "react";
import "./carSubmitSection.css";

function CarSubmitSection({ onSubmit }) {
  return (
    <section className="car-submit">
      <div className="car-submit-divider" />

      <div className="car-submit-inner">
        <button
          type="button"
          className="car-submit-button"
          onClick={onSubmit}
        >
          차량정보 등록하기
        </button>
      </div>
    </section>
  );
}

export default CarSubmitSection;