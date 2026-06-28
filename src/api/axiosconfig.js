import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // .env에서 설정한 주소
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키(세션)를 주고받아야 한다면 유지
});

// [추가된 부분] 요청 인터셉터 (Request Interceptor)
// API 요청을 보내기 직전에 가로채서 토큰을 헤더에 넣습니다.
api.interceptors.request.use(
  (config) => {
    // 1. 로컬 스토리지에서 토큰을 가져옵니다.
    // 주의: 저장할 때 사용한 키 이름('accessToken', 'token' 등)과 일치해야 합니다.
    const token = localStorage.getItem('accessToken'); 

    // 2. 토큰이 있다면 헤더에 추가합니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;