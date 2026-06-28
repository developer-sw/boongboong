import { ReactComponent as Logo } from "../../assets/title.svg";
import { ReactComponent as Character } from "../../assets/character.svg";
import { ReactComponent as Hand } from "../../assets/hand.svg";


import "./Header.css";

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-top">
        <Logo className="logo-svg" />
      </div>

      <div className="header-hero">
        <div className="header-content">
          <p>
            날씨 좋아요!
            <br />
            함께 <strong>여행</strong>을 시작해볼까요?
          </p>
          <p className="subtitle">
            같은 길이 같을지는 몰라요
            <br />
            목적지를 알려주세요
          </p>
        </div>

        <div className="header-illustrations">
          <Character className="character-svg" />
          <Hand className="hand-svg" />
        </div>
      </div>
    </header>
  );
}
