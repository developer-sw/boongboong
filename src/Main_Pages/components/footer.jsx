
import { ReactComponent as FooterImage } from "../../assets/footer.svg";
import './footer.css';

const Footer = () => {
  return (
    // 시맨틱 태그 <footer>를 사용합니다.
    <footer className="footer-container">
      {/* import한 SVG 컴포넌트를 렌더링합니다.
        CSS로 스타일을 제어할 수 있습니다.
      */}
      <FooterImage />
    </footer>
  );
};

export default Footer;