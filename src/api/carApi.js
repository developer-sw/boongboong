// src/api/carApi.js
import api from './axiosconfig';

/**
 * 🚗 차량 이미지 업로드 API
 */
export async function uploadCarImage(file) {
  const url = '/api/upload/vehicle-image';
  
  const formData = new FormData();
  formData.append('file', file);

  console.log("[차량 API] 이미지 업로드 요청:", url, file.name);

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // 🚨 수정된 부분: 서버 응답이 { url: "..." } 형태라면 문자열만 추출
  if (response.data && response.data.url) {
    return response.data.url; // "https://..." 문자열만 반환
  }

  // 만약 서버가 그냥 문자열로 줬다면 그대로 반환
  return response.data; 
}

/**
 * 📝 차량 정보 등록/수정 (Upsert) API
 */
export async function registerOrUpdateCar(email, carNumber, imageUrl, seat, color) {
  const url = `/api/mypage/car?email=${encodeURIComponent(email)}`;

  // ✅ 핵심 수정사항
  // 1. seat -> seats (복수형으로 변경)
  // 2. 숫자 변환 (Number())
  // 3. Postman 예시에 맞춰 데이터 구성
  const data = {
    number: carNumber,     // 필수
    imageUrl: imageUrl,    // 필수
    seats: Number(seat),   // 🔥 중요: 'seat' -> 'seats' 로 변경 및 숫자로 변환
    color: color           // 필수/선택 여부에 따라 전송
  };

  console.log("[차량 API] 정보 등록 요청 데이터:", data);

  // 만약 서버가 { "vehicleInfo": { ... } } 처럼 감싼 형태를 원한다면
  // 아래 주석을 풀고 data 대신 wrappedData를 보내야 합니다.
  // const wrappedData = { vehicleInfo: data };

  const response = await api.post(url, data);

  return response.data;
}

export async function getCarInfo(email) {
  // GET 요청도 이메일이 필요할 것으로 예상됨 (백엔드 명세에 따라 다를 수 있음)
  const url = `/api/mypage/car?email=${encodeURIComponent(email)}`;

  console.log("[차량 API] 정보 조회 요청:", url);

  try {
    const response = await api.get(url);
    // 서버가 { "vehicleInfo": { ... } } 형태로 준다면 response.data.vehicleInfo 리턴
    // 그냥 { ... } 형태로 준다면 response.data 리턴
    return response.data; 
  } catch (error) {
    // 차량 정보가 없는 경우(404) 등 에러 처리
    console.error("[차량 API] 조회 실패:", error);
    throw error;
  }
}