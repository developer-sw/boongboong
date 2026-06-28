import './Title.css'; 
import Searchbar from '../../Main_Pages/components/Searchbar';

// 부모(Search.jsx)로부터 onSearch 함수를 받음
export default function Title({ onSearch }) {
  return (
    <div className="search-page-title-wrapper">
      {/* Searchbar에 그대로 전달 */}
      <Searchbar onSearch={onSearch} />
    </div>
  );
}