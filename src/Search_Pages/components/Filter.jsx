import React, { useState } from 'react';
import { ReactComponent as Sort } from "../../assets/sort.svg";
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';
import './Filter.css'; 

// 날짜를 YYYY-MM-DD 형식으로 변환하는 유틸 함수
const formatDate = (date) => {
  if (!date) return null; // 날짜가 없으면 null 반환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Filter({ onSearch }) {
  const [openModal, setOpenModal] = useState(null); 
  
  // [수정 1] 초기값을 new Date()가 아닌 null로 설정 (처음엔 '일정'으로 표시)
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRideType, setSelectedRideType] = useState('탑승/운전');

  // 현재 필터 상태를 기반으로 검색을 트리거하는 함수
  const triggerSearch = (date, typeLabel) => {
    if (!onSearch) return;

    // [수정 2] 날짜가 있으면 포맷팅, 없으면(null) 그대로 null 전달
    const formattedDate = date ? formatDate(date) : null;

    let typeParam = null;
    if (typeLabel === '탑승자 게시글만') typeParam = 'RIDER';
    else if (typeLabel === '운전자 게시글만') typeParam = 'DRIVER';

    onSearch({
      date: formattedDate, // null이면 전체 조회로 처리됨 (백엔드/부모 로직에 따라 다름)
      type: typeParam,
    });
  };

  // --- 달력 관련 핸들러 ---
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // 날짜 선택 완료 버튼
  const handleSelectComplete = () => {
    // 만약 날짜를 선택하지 않고 완료를 눌렀는데, 기존 값이 null이면 그대로 둠
    // 사용자가 달력에서 날짜를 찍었다면 그 날짜로 검색
    if (selectedDate) {
        console.log("선택 완료 날짜:", formatDate(selectedDate));
        triggerSearch(selectedDate, selectedRideType);
    }
    setOpenModal(null);
  };

  // [수정 3] '전체 일정 보기' (날짜 필터 해제) 핸들러 추가
  const handleClearDate = () => {
    console.log("날짜 필터 해제: 전체 일정 조회");
    setSelectedDate(null); // 상태를 null로 초기화
    setOpenModal(null);    // 모달 닫기
    triggerSearch(null, selectedRideType); // 날짜 없이 검색 요청
  };

  // --- 탑승/운전 관련 핸들러 ---
  const handleRideTypeSelect = (type) => {
    let newTypeLabel = '탑승/운전';
    
    if (type === '필터없음') {
      newTypeLabel = '탑승/운전';
    } else {
      newTypeLabel = type;
    }
    
    setSelectedRideType(newTypeLabel);
    setOpenModal(null);

    triggerSearch(selectedDate, newTypeLabel);
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-container">
        <button className="filter-icon-btn" aria-label="필터 옵션 열기">
          <Sort />
        </button>
        
        <div className="filter-separator"></div>
        
        {/* [수정 4] 날짜 버튼 UI: selectedDate가 있으면 날짜 표시, 없으면 '일정' 표시 */}
        <button className="filter-button" onClick={() => setOpenModal('calendar')}>
          <span>
            {selectedDate 
              ? selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) 
              : '일정'}
          </span>
          <span className="chevron">▼</span>
        </button>
        
        <button className="filter-button" onClick={() => setOpenModal('rideDrive')}>
          <span>{selectedRideType}</span>
          <span className="chevron">▼</span>
        </button>
      </div>

      {/* 달력 모달 */}
      {openModal === 'calendar' && (
        <>
          <div className="modal-backdrop" onClick={() => setOpenModal(null)}></div>
          <div className="calendar-modal-content">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate || new Date()} // null일 때는 오늘 날짜 기준으로 달력 보여줌
              formatShortWeekday={(locale, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
              calendarType="gregory"
              formatDay={(locale, date) => date.getDate()} 
            />
            
            {/* [수정 5] 버튼 영역 분리: 전체보기 vs 선택완료 */}
            <div className="calendar-btn-group" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                    className="select-complete-btn" 
                    onClick={handleClearDate}
                    style={{ backgroundColor: '#e0e0e0', color: '#333' }} // 스타일은 필요에 따라 조정
                >
                전체 일정
                </button>
                <button 
                    className="select-complete-btn" 
                    onClick={handleSelectComplete}
                >
                선택 완료
                </button>
            </div>
          </div>
        </>
      )}

      {/* 탑승/운전 모달 (기존 동일) */}
      {openModal === 'rideDrive' && (
        <>
          <div className="modal-backdrop" onClick={() => setOpenModal(null)}></div>
          <div className="calendar-modal-content">
            <ul className="modal-options-list">
              <li className="modal-options-title">탑승/운전</li>
              <li onClick={() => handleRideTypeSelect('필터없음')}>
                필터없음
              </li>
              <li onClick={() => handleRideTypeSelect('탑승자 게시글만')}>
                탑승자 게시글만
              </li>
              <li onClick={() => handleRideTypeSelect('운전자 게시글만')}>
                운전자 게시글만
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Filter;