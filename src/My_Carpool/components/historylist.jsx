import React, { useEffect, useState } from 'react';
import HistoryItem from './historyitem'; 
import { matchApi } from '../../api/matchApi'; 
import './historylist.css'; 

const HistoryList = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const myEmail = localStorage.getItem('email'); 
        if (!myEmail) {
          setLoading(false);
          return;
        }

        const response = await matchApi.getUpcomingMatches(myEmail);
        const listData = response.data.content || response.data || [];

        const now = new Date(); 

        const futureOnly = listData.filter((item) => {
          if (!item.date || !item.time) return false;
          const safeDate = item.date.replace(/\./g, '-');
          const itemTime = new Date(`${safeDate}T${item.time}`);
          return itemTime > now;
        });

        setHistories(futureOnly);

      } catch (error) {
        console.error("매칭 내역 로딩 실패", error);
        setHistories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div className="history-message">로딩 중...</div>;

  return (
    <div className="history-list">
      {histories.length === 0 ? (
        <p className="history-message">
          예정된 카풀 내역이 없습니다.
        </p>
      ) : (
        histories.map((item, index) => (
          <HistoryItem
            key={item.matchId || item.postId || index} 
            role={item.myRole === 'DRIVER' ? '탑승자' : '드라이버'}
            name={item.nickname || item.name || "익명"} 
            // RouteCard처럼 여러 필드를 확인하여 이미지를 전달
            profileImage={item.profileImageUrl || item.profileImg || item.image || item.profileImage}
            date={item.date} 
            time={item.time}
            departure={item.origin}
            arrival={item.destination}
          />
        ))
      )}
    </div>
  );
};

export default HistoryList;