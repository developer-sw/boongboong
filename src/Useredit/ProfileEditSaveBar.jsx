// src/components/ProfileEditSaveBar.jsx
import React from "react";
// 🚨 [필수] useNavigate를 임포트합니다. (React Router가 설치되어 있어야 합니다)
import { useNavigate } from "react-router-dom"; 
import "./profileEditSaveBar.css";

function ProfileEditSaveBar({ onSave }) {
    // 🚨 useNavigate 훅을 사용해 navigate 함수를 가져옵니다.
    const navigate = useNavigate(); 
    
    const handleClick = async () => {
        if (onSave) {
            try {
                // 상위 컴포넌트(ProfileEditPage)에서 API 호출을 수행합니다.
                await onSave(); 

                // 💡 API 호출이 성공적으로 완료되면 페이지를 이동합니다.
                // 보통 '내 정보' 페이지는 '/profile' 또는 '/mypage' 등의 경로를 사용합니다.
                // 아래 경로를 실제 '내 정보' 페이지의 경로로 변경해주세요.
                navigate("/me"); 
                
            } catch (error) {
                // onSave 내부에서 오류 처리(alert)를 했더라도 
                // 페이지 이동은 실패했을 때 실행되지 않게 합니다.
                console.error("프로필 저장 및 페이지 이동 실패:", error);
            }
        }
    };

    return (
        <div className="profile-edit-save-bar">
            <button
                type="button"
                className="profile-edit-save-button"
                onClick={handleClick}
            >
                수정 완료
            </button>
        </div>
    );
}

export default ProfileEditSaveBar;