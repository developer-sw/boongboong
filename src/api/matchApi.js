import api from './axiosconfig';

export const matchApi = {
  // =========================================================
  // 1. 매칭 요청 및 조회 (Request Match)
  // =========================================================

  // 매칭 요청 (동행 신청) - Postman 1번
  requestMatch: (matchData) => {
    console.log("[API 요청] 매칭 신청:", matchData);
    return api.post('/api/match/requests', matchData);
  },

  // 나에게 온 요청 목록 (기본: PENDING 상태) - Postman 8번
  getIncomingRequests: (status = 'PENDING') => {
    return api.get('/api/match/requests/incoming', {
      params: { status: status, page: 0, size: 20 }
    });
  },

  // 내가 보낸 요청 목록 (기본: PENDING 상태) - Postman 9번
  getSentRequests: (status = 'PENDING') => {
    return api.get('/api/match/requests/sent', {
      params: { status: status, page: 0, size: 20 }
    });
  },

  // 내 매칭 목록 (전체 조회용 / 히스토리) - Postman 11번
  getMyMatches: (status) => {
    const params = { page: 0, size: 20 };
    if (status) params.status = status;
    return api.get('/api/match/matches', { params });
  },

  // =========================================================
  // 2. 리뷰 (Review) - Postman 14, 15번 항목 반영
  // =========================================================

  // [기본] 리뷰 작성 (일반적인 리뷰 작성용)
  // Postman Body: { "matchId": 123, "targetUserId": 456, "rating": 5, "comment": "메모" }
  sendReview: async (data) => {
    return await api.post('/api/reviews', data);
  },

  // ★ [추가] 자동 리뷰 전송 (운행 완료 시 자동 5점 부여용)
  // UI 없이 로직 내부에서 호출하기 편하게 만든 헬퍼 함수입니다.
  sendAutoReview: async (matchId, targetUserId) => {
    const autoData = {
      matchId: Number(matchId),      // 숫자 변환 안전장치
      targetUserId: Number(targetUserId),
      rating: 5,                     // 무조건 5점 (신뢰점수 상승)
      comment: "운행 완료에 따른 신뢰점수 자동 부여" // 기본 멘트
    };
    console.log("[API 요청] 자동 리뷰 전송:", autoData);
    return await api.post('/api/reviews', autoData);
  },

  // 리뷰 가능 여부 확인 - Postman 15번
  // URL: /api/reviews/can?matchId={matchId}&targetUserId={userId}
  checkCanReview: async (matchId, targetUserId) => {
    return await api.get(`/api/reviews/can`, {
      params: { matchId, targetUserId }
    });
  },

  // =========================================================
  // 3. 마이페이지 / 상태 관리 (MyPage & Status)
  // =========================================================

  // 진행 중인 동행 조회 (상단 카드용)
  getOngoingMatch: (email) => {
    return api.get('/api/mypage/ongoing', {
      params: { email: email }
    });
  },

  // 다가올(예정) 카풀 리스트 (하단 목록용)
  getUpcomingMatches: (email) => {
    return api.get('/api/mypage/upcoming/list', {
      params: { email: email }
    });
  },

  // 완료된(과거) 매칭 목록
  getCompletedMatches: (email) => {
    return api.get('/api/mypage/completed/list', {
      params: { email: email }
    }); 
  },

  // =========================================================
  // 4. 운전자 액션 (Driver Actions)
  // =========================================================

  // 매칭 완료 처리 (동행 완료하기 버튼용) - Postman 7번
  completeMatch: (matchId) => {
    return api.post('/api/match/participation/driver/complete', { matchId });
  },

  // 매칭 요청 수락 (승인) - Postman 2번
  approveRequest: (requestId) => {
    return api.post(`/api/match/requests/${requestId}/approve`);
  },

  // 매칭 요청 거절 / 취소 - Postman 3번
  cancelRequest: (requestId) => {
    return api.post(`/api/match/requests/${requestId}/cancel`);
  },

  // 노쇼 처리 - Postman 5번
  noShowMatch: (matchId, memberId) => {
    console.log(`[API 요청] 노쇼 처리 - matchId: ${matchId}, memberId: ${memberId}`);
    return api.post('/api/match/participation/driver/no-show', {
      matchId: Number(matchId), 
      memberId: Number(memberId)
    });
  },

  // 매칭 멤버 목록 조회 - Postman 12번
  getMatchMembers: (matchId) => {
    return api.get(`/api/match/${matchId}/members`, { 
      params: { page: 0, size: 20 } 
    });
  },

  sendNegativeReview: async (matchId, targetUserId) => {
    const autoData = {
        matchId: Number(matchId),
        targetUserId: Number(targetUserId),
        rating: 0, // ★ 0점 (신뢰 점수 감소 목적)
        comment: "노쇼로 인한 신뢰점수 감소" 
    };
    return await api.post('/api/reviews', autoData);
}


};