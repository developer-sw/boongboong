// mypage.Api.js
import axiosInstance from './axiosconfig';

/**
 * 내 정보 전체 조회 (프로필 + 카풀 정보 + 내 글)
 * URL: /api/mypage/me
 */
export const getMyPageData = async (email) => {
  try {
    const response = await axiosInstance.get('/api/mypage/me', {
      params: { email } 
    });
    return response.data;
  } catch (error) {
    console.error('마이페이지 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 내 차량 등록/수정 (Upsert)
 * URL: /api/mypage/car
 */
export const registerMyCar = async (email, carData) => {
  try {
    // carData 예시: { number: "123가4567", imageUrl: "..." }
    const response = await axiosInstance.post(`/api/mypage/car?email=${email}`, carData);
    return response.data;
  } catch (error) {
    console.error('차량 등록 실패:', error);
    throw error;
  }
};

/**
 * 내가 쓴 글 목록 조회
 * URL: /api/mypage/posts
 */
export const getMyPosts = async (email) => {
  try {
    const response = await axiosInstance.get('/api/mypage/posts', {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.error('내 글 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 진행중인 카풀 1건 조회
 * URL: /api/mypage/ongoing
 */
export const getOngoingMatch = async (email) => {
  try {
    const response = await axiosInstance.get('/api/mypage/ongoing', {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.log('진행중인 카풀 조회 결과 없음 혹은 실패:', error);
    throw error;
  }
};

/**
 * 카카오 오픈채팅방 링크 등록/수정
 * URL: /api/users/openchat
 * Method: PUT
 */
export const updateOpenChatUrl = async (openChatUrl) => {
  try {
    const response = await axiosInstance.put('/api/users/openchat', {
      openChatUrl: openChatUrl
    });
    return response.data;
  } catch (error) {
    console.error('오픈채팅방 링크 등록 실패:', error);
    throw error;
  }
};

// ▼▼▼ [새로 추가된 부분: 운전면허증 등록] ▼▼▼

/**
 * 운전면허증 정보 등록 (POST)
 * URL: /api/mypage/license
 * Postman Base URL: https://seosan-issue.shop
 * @param {string} email 사용자 이메일 (쿼리 파라미터)
 * @param {object} licenseData 운전면허증 정보 
 * licenseData 예시: { licenseNumber, licenseType, issuedAt, expiresAt, name, birthDate, address }
 */
export const registerLicense = async (email, licenseData) => {
  // Postman 컬렉션에 따르면 이 API의 기본 URL은 'https://seosan-issue.shop' 입니다.
  // axiosInstance가 다른 기본 URL을 사용한다면, 아래 URL을 조정해야 합니다.
  // 여기서는 Postman에 명시된 전체 URL을 사용합니다.
  const apiUrl = `/api/mypage/license?email=${email}`; // axiosInstance의 baseURL에 따라 조정 필요

  try {
    const response = await axiosInstance.post(apiUrl, licenseData); // Method: POST
    return response.data;
  } catch (error) {
    console.error('운전면허증 등록 실패:', error);
    throw error;
  }
};