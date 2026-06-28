import './Searchbar.css';
import { ReactComponent as Maps } from "../../assets/maps.svg";
import { ReactComponent as Mainsearch } from "../../assets/mainsearch.svg";
import { useState } from 'react';

// 부모 컴포넌트(Search.jsx)로부터 onSearch 함수를 props로 받아옵니다.
export default function SearchBar({ onSearch }) {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('전체'); // UI 표시용
  
  // 검색어 입력을 저장할 state
  const [keyword, setKeyword] = useState('');

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  // ✅ [핵심 수정] 검색 버튼 클릭(또는 엔터) 시 실행할 함수
  const handleSearchClick = () => {
    // 1. UI용 텍스트('출발지', '목적지')를 API용 코드('FROM', 'TO', 'ALL')로 변환
    let searchType = 'ALL'; // 기본값은 전체

    if (selectedFilter === '출발지') searchType = 'FROM';
    else if (selectedFilter === '목적지') searchType = 'TO';

    // 2. 부모(Search.jsx)에게 데이터 전달
    if (onSearch) {
      console.log(`[SearchBar] 검색 실행: ${keyword}, 타입: ${searchType}`);
      onSearch({ 
        keyword: keyword, 
        type: searchType 
      });
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar-title">
        <Maps />
        <span>경로를 검색하세요</span>
      </div>

      <div className="searchbar-input-area">
        <div className="searchbar-filter-wrapper">
          {/* 드롭다운 버튼 */}
          <div 
            className="searchbar-filter"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{selectedFilter}</span>
            <span className="dropdown-arrow">▼</span>
          </div>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="searchbar-dropdown-menu">
              <div onClick={() => handleFilterSelect('전체')}>전체</div>
              <div onClick={() => handleFilterSelect('출발지')}>출발지</div>
              <div onClick={() => handleFilterSelect('목적지')}>목적지</div>
            </div>
          )}
        </div>

        {/* 입력창 */}
        <input 
          type="text" 
          className="searchbar-input" 
          placeholder="장소 입력 (예: 서울)"
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)} 
          onKeyDown={handleKeyPress} // React에서는 onKeyPress보다 onKeyDown을 권장하지만 둘 다 작동합니다
        />

        {/* 검색 버튼 */}
        <button className="searchbar-button" onClick={handleSearchClick}>
          <Mainsearch />
        </button>

      </div>
    </div>
  );
}