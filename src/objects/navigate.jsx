import { NavLink, useLocation } from "react-router-dom";

// 1. SVG 파일들을 React 컴포넌트로 불러옵니다.
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { ReactComponent as SearchIcon } from "../assets/search.svg";
import { ReactComponent as CarIcon } from "../assets/car.svg";
import { ReactComponent as UserIcon } from "../assets/user.svg";

import "./navigate.css";

// 2. NAV_ITEMS의 icon 값을 불러온 SVG 컴포넌트로 교체합니다.
const NAV_ITEMS = [
  { to: "/main",        label: "홈",     icon: HomeIcon },
  { to: "/search",  label: "탐색",    icon: SearchIcon },
  { to: "/carpool", label: "내카풀",  icon: CarIcon },
  { to: "/me",      label: "내정보",  icon: UserIcon },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const activeIndex = NAV_ITEMS.findIndex(i => pathname === i.to || pathname.startsWith(i.to + "/"));

  return (
    <nav role="navigation" aria-label="하단 내비게이션" className="bb-bottomnav">
      <div className="bb-bottomnav__inner">
        <ul className="bb-bottomnav__grid">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const active = idx === (activeIndex === -1 ? 0 : activeIndex);
            return (
              <li key={item.to} className="bb-bottomnav__item">
                <NavLink to={item.to} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
                  <Icon className="bb-icon" />
                  <span className="bb-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}