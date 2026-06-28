// src/Passwd_Find_Pages/Myheader.jsx

import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { ReactComponent as Road } from "../../assets/road.svg";
import { ReactComponent as Title } from "../../assets/title.svg";
import { matchApi } from '../../api/matchApi'; 
import RouteCard from '../../components/RouteCard';
import './myheader.css'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Myheader = () => {
  const navigate = useNavigate(); 
  const [ongoingList, setOngoingList] = useState([]);
  const SHOW_BEFORE_MINUTES = 0;

  // ... (fetchOngoingMatch 및 useEffect 로직은 기존과 동일) ...
  const fetchOngoingMatch = async () => {
    try {
      const email = localStorage.getItem('email');
      if (!email) return;
      // 현재 getUpcomingMatches를 사용하고 있으며, 이 목록을 필터링하여 ongoingList를 구성하고 있습니다.
      const res = await matchApi.getUpcomingMatches(email); 
      if (res.data) {
        const listData = Array.isArray(res.data) ? res.data : (res.data.content || []);
        const now = new Date();
        const currentMatches = listData.filter((item) => {
           if (!item.date || !item.time) return false;
           const safeDate = item.date.replace(/\./g, '-');
           const itemTime = new Date(`${safeDate}T${item.time}`);
           const diffMs = itemTime - now;
           const diffMins = diffMs / 1000 / 60;
           return diffMins <= SHOW_BEFORE_MINUTES; 
        });
        setOngoingList(currentMatches); 
      } else {
        setOngoingList([]);
      }
    } catch (err) {
      console.error("데이터 로드 실패", err);
      setOngoingList([]);
    }
  };

  useEffect(() => {
    fetchOngoingMatch();
    const interval = setInterval(fetchOngoingMatch, 60000); 
    return () => clearInterval(interval);
  }, []);


  // 1. 운행 완료 핸들러 (자동 리뷰 로직 포함)
  const handleAction = async (matchId, targetUserId, targetName, matchStatus) => {
    if (!matchId || !targetUserId) {
      alert("오류: 상대방 정보가 없습니다.");
      return;
    }
    if (!window.confirm("운행을 종료하시겠습니까?")) return;

    try {
      // (1) 운행 종료 API 호출
      await matchApi.completeMatch(matchId);

      // (2) 운행 종료 성공 시, 자동으로 신뢰점수(5점) 리뷰 전송 (운행 완료 로직)
      try {
        // matchApi.sendAutoReview를 사용하면 신뢰 점수가 +5점 됩니다.
        await matchApi.sendAutoReview(matchId, targetUserId); 
        console.log(`[System] ${targetName}님에게 자동 신뢰점수(5점) 부여 완료`);
      } catch (reviewErr) {
        console.error("자동 리뷰 등록 실패 (운행 종료는 정상 처리됨):", reviewErr);
      }

      // (3) 완료 메시지 및 목록 갱신
      alert("운행이 종료되었습니다."); 
      // ★ 추가: 운행 완료 후 즉시 카드를 제거합니다.
      setOngoingList((prevList) => 
        prevList.filter(trip => {
          const currentId = trip.matchId || trip.postId;
          return String(currentId) !== String(matchId);
        })
      );
      fetchOngoingMatch();

    } catch (err) {
      console.error("완료 처리 실패", err);
      fetchOngoingMatch();
    }
  };

// 2. 노쇼 신고 핸들러 (노쇼 처리 후 운행 완료 API 호출 추가)
  const handleNoShow = async (matchId, targetUserId) => {
    if (!matchId || !targetUserId) {
      alert("오류: 신고할 대상 정보가 없습니다.");
      return;
    }

    // ★ 컨펌 문구 변경: 노쇼 처리 후 운행 종료가 진행됨을 명시합니다.
    if (!window.confirm("해당 탑승자를 '노쇼(No-Show)' 처리하시겠습니까? (신뢰 점수 -10점 및 운행 종료)")) return; 

    try {
      // 2~4. realMemberId를 찾는 로직 (기존 동일)
      const res = await matchApi.getMatchMembers(matchId);
      const members = res.data?.content || (Array.isArray(res.data) ? res.data : []);

      const targetMember = members.find(m => 
        (m.userId === Number(targetUserId)) || (m.memberUserId === Number(targetUserId))
      );

      if (!targetMember) {
        alert(`오류: 매칭 멤버 목록에서 유저(ID:${targetUserId})를 찾을 수 없습니다.`);
        return;
      }
      const realMemberId = targetMember.id || targetMember.memberId; 

      // 5. [수정됨] 노쇼 요청 전송 (서버에서 신뢰 점수 -10점 처리)
      // ★★★ 노쇼 API 호출 시 로그 추가 ★★★
      console.log(`[API CALL] 노쇼 요청 전송: matchId=${matchId}, memberId=${realMemberId}`);
      
      const noShowResponse = await matchApi.noShowMatch(matchId, realMemberId);
      
      // ★★★ 노쇼 API 응답 확인 로그 ★★★
      console.log("[API RESPONSE] 노쇼 API 응답:", noShowResponse);


      // 6. 노쇼 처리 후, 해당 매칭을 운행 완료 상태로 강제 변경
      await matchApi.completeMatch(matchId);
      
      // ★ 노쇼 성공 알림 (점수 감소 및 종료 명시)
      alert("노쇼 처리 및 운행 종료가 완료되었습니다. 상대방의 신뢰 점수가 10점 감소됩니다.");

      // ★ [핵심] 화면에서 즉시 제거
      setOngoingList((prevList) => 
        prevList.filter(trip => {
          const currentId = trip.matchId || trip.postId;
          return String(currentId) !== String(matchId);
        })
      );
      
      // 즉시 화면에서 제거되었으므로, fetchOngoingMatch 호출은 주석 처리된 상태로 유지합니다.

    } catch (err) {
      console.error("노쇼 처리 실패:", err);
      // 서버 에러 메시지를 alert 해봅니다.
      const msg = err.response?.data?.message || "처리 중 오류가 발생했습니다.";
      alert(`실패: ${msg}`);
    }
  };

  return (
    <div className="screen-container">
      {/* ... (render 로직은 동일) ... */}
      <div className="screen-container">
        <div className="background-road"><Road className="road-svg" /></div>
        <header className="top-header"><div className="logo-wrapper"><Title className="logo-svg" /></div></header>

        <main className="content-area">
          <h1 className="page-title">현재 진행중인 동행</h1>
          <div className="card-layer-swiper">
            {ongoingList.length > 0 ? (
              <Swiper
                modules={[Pagination]}           
                spaceBetween={20}                
                slidesPerView={1}                
                pagination={{ clickable: true }} 
                className="my-swiper"
              >
                {ongoingList.map((trip) => {
                  const matchId = trip.matchId || trip.postId;
                  const partnerId = trip.partnerUserId; 
                  const partnerName = trip.nickname || "알 수 없음";
                  
                  const isDriver = trip.myRole === 'DRIVER';

                  const cardData = {
                      ...trip,
                      id: matchId,
                      departure: trip.origin,      
                      arrival: trip.destination,    
                      author: {
                        id: partnerId,
                        nickname: partnerName,
                        profileImageUrl: trip.profileImageUrl || trip.profileImg || trip.image
                      }
                  };

                  return (
                      <SwiperSlide key={matchId}>
                        <RouteCard 
                          route={cardData} 
                          isActive={true} 
                          
                          // 1. 동행 완료
                          onComplete={isDriver ? () => handleAction(matchId, partnerId, partnerName, trip.status) : undefined}
                          
                          // 2. 노쇼 신고
                          onNoShow={isDriver ? () => handleNoShow(matchId, partnerId) : undefined}

                          // 3. 버튼 텍스트
                          buttonText={isDriver ? "동행 완료하기" : "동행중"}
                          disabled={!isDriver} 
                        />
                      </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                <p>현재 진행 중인 동행이 없습니다.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Myheader;