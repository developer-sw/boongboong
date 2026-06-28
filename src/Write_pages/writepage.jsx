import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Picker from 'react-mobile-picker';
import FormSection from './formsection'; // 경로 확인 필요 (같은 폴더에 있다면 ./formsection)
import './writepage.css'; 
// API import 추가!
import { carpoolApi } from '../api/carpoolApi'; 
import PathInputIcon from '../assets/pathinput.svg'; 

const generateOptions = () => {
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '10', '20', '30', '40', '50']; 
  return { month: months, day: days, hour: hours, minute: minutes };
};

export default function WritePage() {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [role, setRole] = useState('driver'); // 화면상: 'driver', 'passenger'
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [people, setPeople] = useState('3'); 
  const [memo, setMemo] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // 현재 날짜/시간 기준으로 초기값 설정하면 더 좋음
  const now = new Date();
  const [pickerValue, setPickerValue] = useState({
    month: String(now.getMonth() + 1).padStart(2, '0'), 
    day: String(now.getDate()).padStart(2, '0'), 
    hour: String(now.getHours()).padStart(2, '0'), 
    minute: '00',
  });
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    const { month, day, hour, minute } = pickerValue;
    setDisplayDate(`${month}월 ${day}일 ${hour}:${minute}`);
  }, [pickerValue]);

  const optionGroups = generateOptions();

  // [핵심] 글 업로드 핸들러
  const handleSubmit = async () => {
    if (!departure || !arrival) {
      alert("출발지와 도착지를 모두 입력해주세요!");
      return;
    }

    // 1. 날짜/시간 데이터 포맷팅 (백엔드: date="YYYY-MM-DD", time="HH:mm:ss")
    const currentYear = new Date().getFullYear();
    const formattedDate = `${currentYear}-${pickerValue.month}-${pickerValue.day}`;
    const formattedTime = `${pickerValue.hour}:${pickerValue.minute}:00`;
    
    // 2. 백엔드 전송용 객체 생성 (변수명 매핑 중요!)
    const postData = {
      // role이 'driver'면 'DRIVER', 아니면 'RIDER'로 대문자 변환
      type: role === 'driver' ? 'DRIVER' : 'RIDER', 
      date: formattedDate,
      time: formattedTime,
      from: departure,    // departure -> from
      to: arrival,        // arrival -> to
      memo: memo
    };

    // 운전자일 때만 seats 필드 추가 (탑승자는 인원수 불필요)
    if (role === 'driver') {
      postData.seats = parseInt(people); // capacity -> seats
    }

    setIsLoading(true); 
    try {
      console.log("=== 서버로 전송할 데이터 ===", postData);

      // ✅ 실제 API 호출
      const response = await carpoolApi.createPost(postData);
      
      console.log("성공 응답:", response);
      alert("게시글이 성공적으로 등록되었습니다!");
      
      // 글 목록 페이지(검색 페이지)로 이동
      navigate('/search'); 

    } catch (error) {
      console.error("업로드 실패:", error);
      // 구체적인 에러 메시지 표시
      if (error.response && error.response.data) {
        alert(`업로드 실패: ${error.response.data.message || "오류가 발생했습니다."}`);
      } else {
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="write-container">
      <header className="write-header">
        <button onClick={() => navigate(-1)} className="back-btn">{'<'}</button>
        <h2>게시글 작성</h2>
      </header>

      <div className="form-body">
        
        {/* 1. 역할 선택 */}
        <FormSection title="나는?" required>
          <div className="role-selector">
            <button 
              className={`role-btn ${role === 'driver' ? 'active' : ''}`}
              onClick={() => setRole('driver')}
            >
              운전자
            </button>
            <button 
              className={`role-btn ${role === 'passenger' ? 'active' : ''}`}
              onClick={() => setRole('passenger')}
            >
              탑승자
            </button>
          </div>
        </FormSection>

        {/* 2. 경로 입력 */}
        <FormSection title="경로를 입력해주세요." required>
          <div className="route-input-box">
            <div className="route-icon-wrapper">
              <img src={PathInputIcon} alt="경로 아이콘" className="path-svg" />
            </div>
            <div className="route-inputs-col">
              <input 
                type="text" className="route-input" placeholder="출발지를 입력하세요"
                value={departure} onChange={(e) => setDeparture(e.target.value)}
              />
              <div className="input-divider"></div>
              <input 
                type="text" className="route-input" placeholder="도착지를 입력하세요"
                value={arrival} onChange={(e) => setArrival(e.target.value)}
              />
            </div>
          </div>
        </FormSection>

        {/* 3. 날짜/시간 */}
        <FormSection title="날짜와 출발 시간을 설정해주세요." required>
          <div onClick={() => setIsPickerOpen(true)}>
            <input 
              type="text" className="common-input" placeholder="시간을 선택해주세요"
              value={displayDate} readOnly 
              style={{ cursor: 'pointer', color: '#333', caretColor: 'transparent' }}
            />
          </div>
        </FormSection>

        {/* 4. 탑승 인원 (운전자일 때만 보임) */}
        <FormSection title="탑승 인원을 설정해주세요." required={role === 'driver'}>
            {role === 'driver' ? (
                <div className="custom-dropdown-container">
                    <button 
                        className="dropdown-trigger common-input"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>{people}인</span>
                        <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}>⌵</span>
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            {['1', '2', '3', '4'].map((num) => (
                                <li 
                                    key={num}
                                    className="dropdown-item"
                                    onClick={() => { setPeople(num); setIsDropdownOpen(false); }}
                                >
                                    {num}인
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="common-input disabled-text">-</div>
            )}
        </FormSection>

        {/* 5. 메모 */}
        <FormSection title="메모">
          <textarea 
            className="common-textarea"
            placeholder="하고 싶은 말을 적어보세요!!"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </FormSection>

      </div>

      <button 
        className="submit-btn-fixed" 
        onClick={handleSubmit}
        disabled={isLoading} 
        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
      >
        {isLoading ? '업로드 중...' : '글 업로드'}
      </button>

      {/* --- 휠 피커 모달 --- */}
      {isPickerOpen && (
        <>
          <div className="picker-overlay" onClick={() => setIsPickerOpen(false)} />
          <div className="picker-modal">
            <div className="picker-header">
              <button onClick={() => setIsPickerOpen(false)}>취소</button>
              <span className="picker-title">시간 선택</span>
              <button onClick={() => setIsPickerOpen(false)} style={{color:'#FFD643', fontWeight:'bold'}}>확인</button>
            </div>
            <Picker
              value={pickerValue} onChange={setPickerValue}
              wheelMode="normal" height={200} itemHeight={40}
            >
              <Picker.Column name="month">{optionGroups.month.map(m => <Picker.Item key={m} value={m}>{m}월</Picker.Item>)}</Picker.Column>
              <Picker.Column name="day">{optionGroups.day.map(d => <Picker.Item key={d} value={d}>{d}일</Picker.Item>)}</Picker.Column>
              <Picker.Column name="hour">{optionGroups.hour.map(h => <Picker.Item key={h} value={h}>{h}시</Picker.Item>)}</Picker.Column>
              <Picker.Column name="minute">{optionGroups.minute.map(m => <Picker.Item key={m} value={m}>{m}분</Picker.Item>)}</Picker.Column>
            </Picker>
          </div>
        </>
      )}
    </div>
  );
}