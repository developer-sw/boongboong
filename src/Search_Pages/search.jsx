import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Title from "./components/Title";
import Filter from "./components/Filter";
import { ReactComponent as Banner } from "../assets/banner.svg";
import RouteList from '../components/RouteList'; 
import "./search.css";
import { getMyPageData } from '../api/mypageApi'; 

// ✅ [수정 2] 파일명 대소문자 확인! (보통 컴포넌트 파일은 대문자로 시작합니다)
// 만약 이 파일이 components 폴더에 있다면 '../components/OpenChatNoticeModal'로 바꿔야 합니다.
import OpenChatNoticeModal from '../Kakao/openchatnoticemodal'; 

export default function Search() {
  const navigate = useNavigate(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    dir: 'ALL',
    date: '',    
    rideType: 'ALL'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchUpdate = (newParams) => {
    setSearchParams(prev => ({
      ...prev,      
      ...newParams  
    }));
  };

  const handleWriteClick = async () => {
    try {
      const email = localStorage.getItem('email'); 
      if (!email) {
        alert("로그인이 필요합니다.");
        return; 
      }

      // ✅ [수정 3] api.get(...) 대신 가져온 함수(getMyPageData)를 직접 사용
      // mypageApi.js에 정의된 함수가 데이터를 바로 반환하는지, response를 반환하는지에 따라
      // 아래 코드가 조금 달라질 수 있습니다. 보통은 아래처럼 씁니다.
      const response = await getMyPageData(email);
      
      // 만약 getMyPageData 내부에서 response.data를 리턴한다면: const myData = response;
      // 만약 axios response 통째로 리턴한다면: const myData = response.data;
      const myData = response.data || response; // 안전하게 둘 다 고려

      console.log("내 정보:", myData);

      if (!myData.profile?.openChatUrl) {
        setShowModal(true);
      } else {
        navigate('/write');
      }

    } catch (error) {
      console.error("정보 확인 실패:", error);
      // 에러 발생 시 일단 글쓰기로 보내거나, 얼럿을 띄움
      // navigate('/write'); 
    }
  };

  return (
    <div className="search-page-container">

      <div className="search-align-block">
        <Title onSearch={handleSearchUpdate} />
        <Filter onSearch={handleSearchUpdate} />

        <div className="banner-wrapper">
          <Banner />
        </div>
        
        <RouteList searchParams={searchParams} />
      </div>

      <button 
        className={`fab-create-post ${isScrolled ? 'shrink' : ''}`}
        onClick={handleWriteClick} 
      >
        <span className="icon">+</span>
        <span className="text">글쓰기</span>
      </button>

      {/* ✅ [수정 4] 모달 파일명/컴포넌트 이름이 정확한지 다시 확인해주세요 */}
      {showModal && (
        <OpenChatNoticeModal onClose={() => setShowModal(false)} />
      )}

    </div>
  );
}