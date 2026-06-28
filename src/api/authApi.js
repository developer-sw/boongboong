// src/api/authApi.js
// 🚨 사진에 있는 파일명(axiosconfig)에 맞춰서 import 경로를 수정했습니다.
import api from './axiosconfig';

export const authApi = {
  // --- 기존 로그인/로그아웃 ---
  login: async (email, password) => {
    const data = {
      username: email,
      password: password,
    };
    return await api.post('/api/auth/login', data);
  },

  getMe: async () => {
    return await api.get('/api/auth/me');
  },

  logout: async () => {
    return await api.post('/api/auth/logout');
  },

  // --- 👇 추가된 비밀번호 재설정 관련 API ---

  // 1단계: 인증 코드 전송
  sendResetCode: async (email) => {
    return await api.post('/api/auth/password/reset-code', { email });
  },

  // 2단계: 인증 코드 검증
  verifyResetCode: async (email, code) => {
    return await api.post('/api/auth/password/verify-code', { email, code });
  },

  // 3단계: 비밀번호 변경 (Postman Body 키값: newPassword)
resetPassword: async (email, newPassword, confirmPassword) => {
    return await api.post('/api/auth/password/reset', { 
      email, 
      newPassword,
      confirmPassword // 서버가 이 필드를 요구하고 있습니다.
    });
  }
};