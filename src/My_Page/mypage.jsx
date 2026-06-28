import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// axios 설정 파일 import
import api from '../api/axiosconfig'; 

// 컴포넌트 Import
import TopNavigate from './components/topnavigate';
import Profile from './components/profile';
import MannerScore from './components/mannerscore';
import CarInfo from '../CardDetail/part/carinfo';
import DriverInfo from '../CardDetail/part/driverinfo';

import './mypage.css';

const MyPage = () => {
  const navigate = useNavigate();

  // 사용자 데이터 상태 관리
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. 로그인 정보 확인 (내 이메일 가져오기)
        const authResponse = await api.get('/api/auth/me');
        const myEmail = authResponse.data.email; 
        
        if (!myEmail) throw new Error("로그인 정보가 없습니다.");

        // 2. 마이페이지 데이터 가져오기
        // (이 응답 안에 profile과 reviews가 모두 들어있다고 가정)
        const myPageResponse = await api.get('/api/mypage/me', {
          params: { email: myEmail },
        });

        console.log("내 정보 전체 응답:", myPageResponse.data); 
        setUserData(myPageResponse.data);

      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return (
    <div className="loading-wrapper">
      <div className="spinner"></div>
      <p>붕붕이가 정보를 가져오는 중...</p>
    </div>
  );

  if (error) return <div className="error">정보를 불러올 수 없습니다.</div>;
  if (!userData) return null;

  // ★ 데이터 구조 분해 (서버 응답 구조에 맞춰 수정 필요)
  // userData = { profile: {...}, reviews: [...] } 구조라고 가정합니다.
  const myProfile = userData.profile || {};
  //const myReviews = userData.reviews || []; // 리뷰 데이터 추출

  return (
    <div className="mypage-wrapper">
      <TopNavigate 
        title={`${myProfile.nickname || '사용자'}님의 프로필`}
        isMyPage={true} 
        onBackClick={() => navigate(-1)} 
        onSettingClick={() => navigate('/settings')} 
      />

      <div className="mypage-content">
        <Profile 
          isMyPage={true}
          nickname={myProfile.nickname}
          initial={myProfile.nickname ? myProfile.nickname.charAt(0) : ''}
          // 프로필 이미지도 있다면 전달
          profileImage={myProfile.profileImageUrl} 
          onEditClick={() => navigate('/settings/edit-profile')}
        />

        <MannerScore score={myProfile.trustScore || 0} />
        
        <div className="divider"></div>

        {myProfile.vehicleInfo ? (
          <div className="info-section">
            <CarInfo carData={myProfile.vehicleInfo} />
          </div>
        ) : (
          <div className="info-section" style={{padding: '20px', color: '#999', textAlign: 'center', fontSize: '14px'}}>
            등록된 차량이 없습니다.
          </div>
        )}

        <div className="info-section">
            {/* ★ [핵심 수정] driverData와 함께 reviewData를 넘겨줍니다. */}
            <DriverInfo 
              driverData={myProfile} 
              //reviewData={myReviews} 
            />
        </div>

      </div>
    </div>
  );
};

export default MyPage;