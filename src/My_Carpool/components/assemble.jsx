// src/My_Carpool/components/assemble.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { matchApi } from '../../api/matchApi'; 
import RequestCard from './requestcard';
import SentRequestItem from './sentrequestitem';
import HistoryList from './historylist'; 
import './assemble.css';

const Assemble = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedList, setReceivedList] = useState([]); 
  const [sentList, setSentList] = useState([]);        
  const [processingIds, setProcessingIds] = useState(new Set());

  const fetchData = useCallback(async () => {
    try {
      if (activeTab === 'received') {
        console.log("📥 [API 요청] 받은 요청 목록 조회 중...");
        const res = await matchApi.getIncomingRequests();
        
        // ★ [로그 추가] 받은 요청 데이터 확인
        console.log("🔥 [API 응답] 받은 요청 Raw Data:", res.data);

        const list = res.data.content || res.data || [];
        console.log("📋 [State 적용] 받은 요청 List:", list);
        setReceivedList(list);

      } else {
        console.log("📤 [API 요청] 보낸 요청 목록 조회 중...");
        const res = await matchApi.getSentRequests();
        
        // ★ [로그 추가] 보낸 요청 데이터 확인
        console.log("🔥 [API 응답] 보낸 요청 Raw Data:", res.data);

        const list = res.data.content || res.data || [];
        console.log("📋 [State 적용] 보낸 요청 List:", list);
        setSentList(list);
      }
    } catch (error) {
      console.error("❌ 데이터 로딩 실패:", error);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 1. 수락 핸들러
  const handleApprove = async (id) => {
    if (processingIds.has(id)) return;
    const isConfirmed = window.confirm("매칭을 수락하시겠습니까?\n미리 등록해둔 오픈채팅방 링크가 전송됩니다.");
    if (!isConfirmed) return;

    setProcessingIds(prev => new Set(prev).add(id));

    try {
      await matchApi.approveRequest(id);
      
      setReceivedList((prev) => prev.filter((item) => item.requestId !== id));
      alert("수락되었습니다. 상대방에게 알림이 전송되었습니다.");

    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("이미 완료된 요청입니다.");
        fetchData(); 
      } else {
        alert("처리 실패: " + (err.response?.data?.message || "오류 발생"));
      }
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // ★ 2. [수정됨] 거절 핸들러 (받은 요청 탭용)
  const handleReject = async (id) => {
    if (processingIds.has(id)) return;
    if (!window.confirm("정말 이 요청을 거절하시겠습니까?")) return;

    setProcessingIds(prev => new Set(prev).add(id));

    try {
      // 거절 API 호출
      await matchApi.cancelRequest(id);
      
      // 목록에서 제거
      setReceivedList((prev) => prev.filter((item) => item.requestId !== id));
      alert("요청이 거절되었습니다.");

    } catch (err) {
      console.error("거절 실패:", err);
      alert("거절 처리 실패: " + (err.response?.data?.message || "오류"));
      fetchData(); 
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // ★ 3. [수정됨] 취소 핸들러 (보낸 요청 탭용)
  const handleCancelSent = async (id) => {
    if (processingIds.has(id)) return;
    if (!window.confirm("보낸 요청을 취소하시겠습니까?")) return;

    setProcessingIds(prev => new Set(prev).add(id));

    try {
      // 취소 API 호출 (API 주소는 같을 수 있으나 탭 구분 위함)
      await matchApi.cancelRequest(id);
      
      // 목록에서 제거
      setSentList((prev) => prev.filter((item) => item.requestId !== id));
      alert("요청이 취소되었습니다.");

    } catch (err) {
      console.error("취소 실패:", err);
      alert("취소 실패");
      fetchData(); 
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="assemble-page-wrapper">
      <div className="history-container">
        <div className="tab-header">
          <button 
            className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            신청 받은 동행
            {activeTab === 'received' && <motion.div layoutId="tab-indicator" className="tab-indicator" />}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            신청 보낸 동행
            {activeTab === 'sent' && <motion.div layoutId="tab-indicator" className="tab-indicator" />}
          </button>
        </div>

        <div className="tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'received' ? (
                /* === 받은 요청 탭 === */
                <div className="received-grid">
                  {receivedList.length > 0 ? receivedList.map((req) => (
                      <RequestCard 
                        key={req.requestId} 
                        // 이름/이미지 경로 데이터 로그 확인 후 수정 필요할 수 있음
                        name={req.requester?.nick || req.senderName || "알 수 없음"} 
                        profileImage={req.requester?.profileImageUrl || req.profileImage}
                        
                        onApprove={() => handleApprove(req.requestId)}
                        // ★ 거절 핸들러 연결
                        onReject={() => handleReject(req.requestId)}
                        
                        disabled={processingIds.has(req.requestId)}
                      />
                  )) : <p className="no-data">받은 요청이 없습니다.</p>}
                </div>
              ) : (
                /* === 보낸 요청 탭 === */
                <div className="sent-list">
                  {sentList.length > 0 ? sentList.map((req) => (
                      <SentRequestItem 
                        key={req.requestId}
                        name="나" 
                        targetName={req.receiver?.nick || "상대방"} 
                        profileImage={req.receiver?.profileImageUrl || req.profileImg}
                        
                        // ★ 취소 핸들러 연결
                        onCancel={() => handleCancelSent(req.requestId)}
                        
                        disabled={processingIds.has(req.requestId)}
                      />
                  )) : <p className="no-data">보낸 요청이 없습니다.</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="completed-section">
          <h3 className="section-title">성사된 카풀 목록</h3>
          <HistoryList />
        </div>
      </div>
    </div>
  );
};

export default Assemble;