// src/api/noticeApi.js

const SSE_URL = `${process.env.REACT_APP_API_URL}/api/notify/stream`;
let eventSource = null;

export const noticeApi = {
  connect: (onNotify, onInit, onError) => {
    // 이미 연결되어 있다면 중단
    if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
      console.log('⚠️ SSE가 이미 연결되어 있습니다.');
      return;
    }

    console.log(`🚀 [SSE 연결 시작] URL: ${SSE_URL}`);

    // SSE 객체 생성
    eventSource = new EventSource(SSE_URL, { withCredentials: true });

    // 1. [연결 성공] - 서버와 통신선이 뚫렸을 때
    eventSource.onopen = () => {
       console.log("✅ [SSE 연결 성공] 서버와 연결되었습니다! (Status 200)");
    };

    // 2. [모든 메시지 수신] - 이름표 없는 기본 메시지 잡기 (가장 중요!)
    eventSource.onmessage = (event) => {
      console.log("📨 [기본 메시지 수신] 이름 없는 이벤트 도착:", event.data);
      // 혹시 서버가 이름을 안 붙여 보냈더라도 여기서 처리 시도
      try {
        const data = JSON.parse(event.data);
        if (onNotify) onNotify(data);
      } catch (e) {
        console.error('데이터 파싱 실패:', e);
      }
    };

    // 3. [특정 이벤트 수신] - 'notify' 이름표가 붙은 메시지
    eventSource.addEventListener('notify', (event) => {
      console.log('🔔 [notify 이벤트 수신]:', event.data);
      try {
        const data = JSON.parse(event.data);
        if (onNotify) onNotify(data);
      } catch (e) {
        console.error('notify 파싱 실패:', e);
      }
    });

    // 4. [특정 이벤트 수신] - 'init' (초기화)
    eventSource.addEventListener('init', (event) => {
      console.log('📡 [init 이벤트 수신]:', event.data);
      if (onInit) onInit(event);
    });

    // 5. [에러 발생]
    eventSource.onerror = (error) => {
      console.warn("💥 [SSE 에러] 연결 상태 확인 필요", error);
      // 에러가 나면 브라우저가 자동으로 재연결을 시도하므로, 
      // 여기서 굳이 close()를 하지 않는 것이 좋을 때도 있습니다.
      if (onError) onError(error);
    };
  },

  close: () => {
    if (eventSource) {
      console.log('🔒 [SSE 연결 종료]');
      eventSource.close();
      eventSource = null;
    }
  },
  
  getReadyState: () => eventSource ? eventSource.readyState : EventSource.CLOSED,
};