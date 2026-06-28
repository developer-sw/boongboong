import React, { useEffect, useRef, useCallback, useState } from 'react';
import { noticeApi } from './api/noticeApi'; 
import { motion, AnimatePresence } from 'framer-motion';
import './NotificationHandler.css';
import { ReactComponent as Chat } from "./assets/chat.svg"; 

const NotificationHandler = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatUrl, setChatUrl] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const handledEvents = useRef(new Set());

  const showToast = (message) => {
    // console.log(`[TOAST] ${message}`);
  };

  const handleApprovedNotification = useCallback((data) => {
    console.log("🔥 [SSE 수신] 데이터 도착:", data);

    const eventKey = `req-${data.requestId}`;
    if (handledEvents.current.has(eventKey)) return;
    handledEvents.current.add(eventKey);
    setTimeout(() => handledEvents.current.delete(eventKey), 120000); 

    if (data.type === 'REQUEST_APPROVED') {
      const link = data.openChatUrl;
      
      const myEmail = localStorage.getItem('email'); 
      const driverEmailFromServer = data.driverEmail || data.senderEmail; 

      // 🚗 운전자라면 함수 종료 (모달 안 띄움)
      if (myEmail && driverEmailFromServer && myEmail === driverEmailFromServer) {
        return; 
      }

      // 🙋‍♀️ 탑승자라면 모달 오픈
      if (link) {
        const name = data.driverName || data.senderName || "상대방";
        setPartnerName(name);
        setChatUrl(link);
        setIsOpen(true);
        showToast("매칭 성사! 오픈채팅방이 도착했습니다.");
      }
    }
  }, []);

  const handleSSEError = useCallback((error) => console.warn("⚡ SSE 에러", error), []);
  const handleInit = useCallback(() => console.log("📡 SSE 연결 성공"), []);

  useEffect(() => {
    noticeApi.connect(handleApprovedNotification, handleInit, handleSSEError);
  }, [handleApprovedNotification, handleInit, handleSSEError]);

  const closeModal = () => {
    setIsOpen(false);
    setChatUrl('');
  };

  const handleGoChat = () => {
    if (chatUrl) {
      window.open(chatUrl, '_blank');
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
    <div className="modal-overlay-notice-modal-container">
      <div className="modal-content">
        <h2> 동행 신청이 승인되었어요</h2>
        <p>오픈채팅에서 1:1로 동행 조종을 해보세요<br/>익명 프로필을 사용하여 개인정보를 보호할 수 있어요</p>
        
        <Chat className="modal-image" />

        <button className="btn-register" onClick={handleGoChat}>
          오픈채팅 하러가기 →
        </button>
      </div>
    </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationHandler;