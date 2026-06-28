import api from './axiosconfig'; 

export const carpoolApi = {
  // 1. 글 작성 API
  createPost: (postData) => api.post('/api/carpool/posts', postData),

  // 2. 전체 게시글 조회
  getAllPosts: () => api.get('/api/carpool/posts'),

  // 3. 검색 API
  searchPosts: (searchData) => {
    const incomingDir = searchData.dir || searchData.type || 'ALL';
    const upperDir = incomingDir.toUpperCase();
    let dirValue = 'ALL';

    if (['FROM', 'DEPARTURE', '출발', '출발지'].includes(upperDir)) {
      dirValue = 'FROM';
    } else if (['TO', 'ARRIVAL', 'DESTINATION', '도착', '도착지'].includes(upperDir)) {
      dirValue = 'TO';
    }

    console.log(`[API 요청] 검색어: ${searchData.keyword}, 방향: ${dirValue}, 날짜: ${searchData.date}`);

    return api.get('/api/carpool/posts/search', {
      params: {
        place: searchData.keyword,
        dir: dirValue,
        date: searchData.date,
        page: searchData.page || 0,
        size: searchData.size || 20
      }
    });
  },
  
  // 4. 단건 조회 & 삭제
  getPostById: (id) => api.get(`/api/carpool/posts/${id}`),
  deletePost: (id) => api.delete(`/api/carpool/posts/${id}`),

  // [추가] 5. 동행 신청 (UI의 '동행 신청' 버튼용)
  // 백엔드 URL이 아직 없다면 이대로 두었다가 나중에 수정하세요.
  requestCarpool: (id) => api.post(`/api/carpool/posts/${id}/request`),
};