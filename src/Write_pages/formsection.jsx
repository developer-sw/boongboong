// components/FormSection.jsx
import React from 'react';

// title: "나는?", "경로를 입력해주세요" 같은 제목
// required: 빨간 별표(*) 표시 여부
// children: 실제 입력 컴포넌트 (input, select 등)
const FormSection = ({ title, required, children }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ 
        fontSize: '1.1rem', 
        fontWeight: '700', 
        marginBottom: '0.8rem' 
      }}>
        {title}
        {required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}
      </h3>
      {children}
    </div>
  );
};

export default FormSection;