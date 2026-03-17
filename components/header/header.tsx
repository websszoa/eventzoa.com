import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";

export default function Header() {
  return (
    <header className="header__container">
      <div className="flex items-center justify-between">
        <HeaderLeft />
        <HeaderRight />
      </div>
    </header>
  );
}
