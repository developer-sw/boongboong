import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './detail.css';

// [API] carpoolApi와 새로 만든 matchApi import
import { carpoolApi } from '../api/carpoolApi';
import { matchApi } from '../api/matchApi';

// [컴포넌트]
import Head from './part/head';
import RouteDetail from './part/routedetail';
import CarInfo from './part/carinfo';
import DriverInfo from './part/driverinfo';

const Detail = () => {
  const { id } = useParams(); // URL의 id (postId)
  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. 게시글 상세 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await carpoolApi.getPostById(id);
        console.log("상세 데이터 수신:", response.data);
        setPostData(response.data);
      } catch (error) {
        console.error("로딩 실패:", error);
        alert("존재하지 않거나 삭제된 게시글입니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // 2. 동행 신청 핸들러 (수정됨)
  const handleRequest = async () => {
    // 유효하지 않은 게시글 ID 체크
    const postIdNum = parseInt(id, 10);
    if (isNaN(postIdNum)) {
      alert("잘못된 게시글 ID입니다.");
      return;
    }

    // 2-1. 사용자에게 신청 여부 확인
    if (!window.confirm("이 카풀에 동행을 신청하시겠습니까?")) return;

    // 2-2. 탑승 인원 입력 받기 (기본값 1명)
    const seatsInput = window.prompt("탑승할 인원 수를 입력해주세요.", "1");
    
    // 취소 버튼을 눌렀을 경우
    if (seatsInput === null) return;

    const seats = parseInt(seatsInput, 10);
    
    // 유효성 검사
    if (isNaN(seats) || seats <= 0) {
      alert("올바른 인원 수를 입력해주세요.");
      return;
    }

    // 2-3. API 호출
    try {
      await matchApi.requestMatch({
        postId: postIdNum,
        seats: seats
      });
      
      alert("동행 신청이 완료되었습니다!\n운전자가 승인하면 매칭이 성사됩니다.");
      
      // [수정] 신청 성공 시 홈 화면으로 이동
      navigate('/main'); 
      
    } catch (error) {
      console.error("신청 에러 상세:", error);
      
      // [디버깅] 서버 응답 데이터 확인용 로그
      if (error.response) {
        console.log("서버 응답 데이터:", error.response.data);
        console.log("상태 코드:", error.response.status);
      }

      // 에러 메시지 추출
      let errorMsg = "신청 중 알 수 없는 오류가 발생했습니다.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } 
        else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
      }

      alert(`[신청 실패] ${errorMsg}`);
    }
  };

  const handleBack = () => navigate(-1);

if (loading) return (
  <div className="loading-wrapper">
    <div className="spinner"></div>
    <p>붕붕이가 정보를 가져오는 중...</p>
  </div>
);
  if (!postData) return <div className="detail-container">데이터 없음</div>;

  return (
    <div className="detail-container">
      <Head 
        title={`${postData.author ? postData.author.nickname : '운전자'} 님의 게시글`} 
        onBackClick={handleBack} 
      />

      <div className="detail-content">
        <RouteDetail routeData={postData} />
        
        <CarInfo carData={postData.vehicle} />
        
        <DriverInfo 
          driverData={postData.author}
          reviewData={postData.reviews} 
        />
      </div>

      <div className="bottom-action-bar">
        <button className="request-btn" onClick={handleRequest}>
          동행 신청
        </button>
      </div>
    </div>
  );
};

export default Detail;