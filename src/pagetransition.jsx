import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}     // 처음에 투명하고 살짝 아래에 있음
      animate={{ opacity: 1, y: 0 }}      // 나타나면서 투명도 1, 제자리로 이동
      exit={{ opacity: 0, y: -20 }}       // 사라질 때 투명해지면서 위로 살짝 이동
      transition={{ duration: 0.3 }}      // 0.3초 동안 부드럽게
      style={{ width: '100%', height: '100%' }} // 크기 꽉 채우기
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;