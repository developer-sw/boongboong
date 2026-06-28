// src/components/CarBasicInfoSection.jsx
import React from "react";
import "./carBasicInfoSection.css";

function CarBasicInfoSection({ info, onChange }) {
  return (
    <section className="car-basic-section">
      <div className="car-basic-title-row">
        <h2 className="car-basic-title">차량 기본 정보</h2>
      </div>

      {/* 차량번호 */}
      <div className="car-basic-field">
        <label className="car-basic-label" htmlFor="car-number">
          차량번호
        </label>
        <div className="car-basic-input-box">
          <input
            id="car-number"
            type="text"
            className="car-basic-input"
            placeholder="12가 1234"
            value={info.number}
            onChange={onChange}
          />
        </div>
      </div>

      {/* 좌석 수 + 색상 */}
      <div className="car-basic-row">
        <div className="car-basic-field car-basic-field--half">
          <label className="car-basic-label" htmlFor="car-seat">
            좌석 수
          </label>
          <div className="car-basic-input-box">
            <input
              id="car-seat"
              type="text"
              className="car-basic-input"
              placeholder="4인승"
              value={info.seat}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="car-basic-field car-basic-field--half">
          <label className="car-basic-label" htmlFor="car-color">
            색상
          </label>
          <div className="car-basic-input-box">
            <input
              id="car-color"
              type="text"
              className="car-basic-input"
              placeholder="흰색"
              value={info.color}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarBasicInfoSection;