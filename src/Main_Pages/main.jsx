// 1. 컴포넌트들 불러오기
import { useState } from 'react'; // state 관리를 위해 추가
import Header from "./components/Header";
import Searchbar from "./components/Searchbar"; 
import RouteList from "../components/RouteList";
import Footer from "./components/footer";
import "./main.css"; 

export default function Main() {
  // [추가] 검색 조건을 관리하는 State
  // 초기값 null (검색 안 함)
  const [searchParams, setSearchParams] = useState(null);

  // [추가] 검색바에서 엔터/클릭 시 실행될 함수
  const handleSearch = (params) => {
    console.log("메인 페이지 검색 요청:", params);
    setSearchParams(params); // 검색 조건 업데이트 -> RouteList가 다시 렌더링됨
  };

  return (
    <div className="main-page-container">
      
      {/* 1. 헤더 */}
      <Header />

      {/* 2. 검색창 */}
      {/* onSearch props로 handleSearch 함수를 전달합니다. */}
      <Searchbar onSearch={handleSearch} />

      {/* 3. 경로 목록 */}
      {/* 핵심 로직:
         - searchParams가 있으면(검색 중이면) limit={null}로 설정하여 전체 목록(페이지네이션 포함)을 보여줌
         - searchParams가 없으면(평소) limit={3}으로 설정하여 최신글 3개만 보여줌
      */}
      <RouteList 
        limit={searchParams ? null : 3} 
        searchParams={searchParams} 
      />

      <Footer />
    </div>
  );
}