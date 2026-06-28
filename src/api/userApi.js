import axiosInstance from "./axiosconfig"; // 설정된 axios 인스턴스를 가져옵니다.

/**
 * 1. 회원가입
 * Method: POST
 * Path: /api/users/signup
 */
export const signup = async (userData) => {
  // userData 예시: { email, password, name, nickname, age }
  const response = await axiosInstance.post("/api/users/signup", userData);
  return response.data;
};

/**
 * 2. 이메일 인증 코드 전송
 * Method: POST
 * Path: /api/users/email/request
 */
export const sendEmailVerification = async (email) => {
  const response = await axiosInstance.post("/api/users/email/request", {
    email,
  });
  return response.data;
};

/**
 * 3. 이메일 인증 코드 검증
 * Method: POST
 * Path: /api/users/email/verify
 */
export const verifyEmailCode = async (email, code) => {
  const response = await axiosInstance.post("/api/users/email/verify", {
    email,
    code,
  });
  return response.data;
};

/**
 * 4. 이메일 중복 확인
 * Method: GET
 * Path: /api/users/email/exists
 */
export const checkEmailDuplicate = async (email) => {
  const response = await axiosInstance.get("/api/users/email/exists", {
    params: { email },
  });
  return response.data; // true(중복) or false(사용가능) 반환 가정
};

/**
 * 5. 닉네임 중복 확인
 * Method: GET
 * Path: /api/users/nickname/exists
 */
export const checkNicknameDuplicate = async (nickname) => {
  const response = await axiosInstance.get("/api/users/nickname/exists", {
    params: { nickname },
  });
  return response.data; // true(중복) or false(사용가능) 반환 가정
};

/**
 * 6. 닉네임 변경
 * Method: PUT
 * Path: /api/users/nickname
 */
export const updateNickname = async (email, nickname) => {
  const response = await axiosInstance.put("/api/users/nickname", {
    email,
    nickname,
  });
  return response.data;
};