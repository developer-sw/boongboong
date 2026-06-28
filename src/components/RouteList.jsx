import React, { useState, useMemo, useEffect } from 'react';
import RouteCard from '../components/RouteCard'; 
import './RouteList.css'; 
import './Pagination.css'; 

// carpoolApi 가져오기
import { carpoolApi } from '../api/carpoolApi';

const PAGES_PER_GROUP = 5;

export default function RouteList({ limit, searchParams }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;

        // 1. 검색어(searchParams)가 있으면 검색 API, 없으면 전체 API 호출
        if (!searchParams || (!searchParams.keyword && !searchParams.type)) {
          console.log("🚗 전체 목록 조회");
          response = await carpoolApi.getAllPosts();
        } else {
          console.log("🔍 검색 조건 조회:", searchParams);
          response = await carpoolApi.searchPosts(searchParams);
        }
        
        // 2. 응답 데이터 구조 안전하게 파싱
        let rawList = [];
        if (response.data) {
          if (Array.isArray(response.data.items)) rawList = response.data.items;
          else if (Array.isArray(response.data.content)) rawList = response.data.content;
          else if (Array.isArray(response.data)) rawList = response.data;
        }

        // ==================================================================
        // 🛠️ [문제 해결 구간] 클라이언트 사이드 강제 필터링
        // ==================================================================
        if (searchParams) {
            const keyword = searchParams.keyword;
            const searchType = searchParams.type || searchParams.dir;

            // (A) 출발/도착 정확히 구분하기
            if (keyword && keyword.trim() !== '') {
                if (searchType === 'FROM' || searchType === '출발지') {
                    rawList = rawList.filter(item => item.from && item.from.includes(keyword));
                } else if (searchType === 'TO' || searchType === '목적지' || searchType === '도착지') {
                    rawList = rawList.filter(item => item.to && item.to.includes(keyword));
                }
            }

            // (B) 탑승자/운전자 구분
            const userType = searchParams.userType || searchParams.rideType;
            if (userType && userType !== 'ALL' && userType !== '탑승/운전') {
                rawList = rawList.filter(item => item.type === userType);
            }

            // (C) 날짜 필터링
            if (searchParams.date) {
                rawList = rawList.filter(item => item.date === searchParams.date);
            }
        }

        const now = new Date();
        
        rawList = rawList.filter(item => {
             if (!item.date || !item.time) return false;
             const postDateTime = new Date(`${item.date}T${item.time}`);
             return postDateTime > now;
        });
        // ==================================================================
        // 4. 데이터 매핑
        const mappedData = rawList.map(item => ({
          id: item.id,
          type: item.type,   // DRIVER | RIDER
          from: item.from,   
          to: item.to,
          date: item.date,
          time: item.time,
          author: item.author || { nick: '익명', profileImg: null }, 
          memo: item.memo || "",
          seats: item.seats
        }));

        // 최신순 정렬 (ID 내림차순)
        setRoutes(mappedData.sort((a, b) => b.id - a.id));
        setCurrentPage(1);

      } catch (error) {
        console.error("목록 불러오기 실패:", error);
        setRoutes([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // --- 페이지네이션 로직 ---
  const sortedRoutes = routes; 
  const totalItems = sortedRoutes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentGroup = Math.ceil(currentPage / PAGES_PER_GROUP);
  const lastGroup = Math.ceil(totalPages / PAGES_PER_GROUP);
  
  const lastPageInGroup = currentGroup * PAGES_PER_GROUP;
  const startPageInGroup = lastPageInGroup - PAGES_PER_GROUP + 1;
  
  const pageNumbers = [];
  for (let i = startPageInGroup; i <= Math.min(lastPageInGroup, totalPages); i++) {
    pageNumbers.push(i);
  }

  const itemsToDisplay = useMemo(() => {
    if (limit) return sortedRoutes.slice(0, limit);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return sortedRoutes.slice(firstIndex, lastIndex);
  }, [limit, sortedRoutes, currentPage, itemsPerPage]);

  const handlePageClick = (n) => setCurrentPage(n);
  const handlePrevGroup = () => setCurrentPage(Math.max(1, (currentGroup - 2) * PAGES_PER_GROUP + 1));
  const handleNextGroup = () => setCurrentPage(Math.min(totalPages, currentGroup * PAGES_PER_GROUP + 1));

  // [수정됨] 로딩 시 CSS(.loading-wrapper)를 적용하기 위해 구조 변경 및 래퍼 추가
  if (loading) return (
    <div className="route-list-wrapper">
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p>목록을 불러오고 있습니다... 🚗</p>
      </div>
    </div>
  );

  return (
    // [수정됨] CSS 스코핑을 위한 최상위 래퍼 추가
    <div className="route-list-wrapper">
        <div className="route-list-container">
        {limit && (
            <div className="route-list-header">
            <div className="header-title-group">
                <h2>신규 경로</h2>
                <p>최근 등록된 경로들을 살펴보세요.</p>
            </div>
            <a href="/search" className="view-all-link">전체보기 &gt;</a>
            </div>
        )}

        <div className="cards-wrapper">
            {itemsToDisplay.length > 0 ? (
            itemsToDisplay.map(item => (
                <RouteCard 
                key={item.id} 
                route={item} 
                rightElement={
                    <span style={{
                    fontSize: '0.91rem', 
                    fontWeight: 'bold', 
                    }}>
                    {item.type === 'DRIVER' ? '운전자' : '탑승자'}
                    </span>
                }
                />
            ))
            ) : (
            <div style={{padding:60, textAlign:'center', color:'#999'}}>
                <p style={{marginBottom: 8, fontSize: '1.2rem'}}>검색 결과가 없습니다</p>
                <p style={{fontSize: '0.9rem'}}>다른 키워드로 검색해보세요.</p>
            </div>
            )}
        </div>

        {!limit && totalPages > 1 && (
            <nav className="pagination-container">
            <button onClick={handlePrevGroup} disabled={currentGroup===1}>&lt;</button>
            {pageNumbers.map(n => (
                <button key={n} onClick={()=>handlePageClick(n)} className={`page-number ${currentPage===n?'active':''}`}>{n}</button>
            ))}
            <button onClick={handleNextGroup} disabled={currentGroup===lastGroup}>&gt;</button>
            </nav>
        )}
        </div>
    </div>
  );
}