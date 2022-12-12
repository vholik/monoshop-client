import { HeaderStyles } from "./Header.styles";
import Image from "next/image";
import SearchIcon from "@public/images/search.svg";
import Logo from "@public/images/logo.svg";
import UnfilledHeart from "@public/images/unfilled-heart.svg";
import Link from "next/link";

export default function Header() {
  return (
    <div className="container">
      <HeaderStyles>
        <div className="input-wrapper">
          <Image
            src={SearchIcon}
            height={16}
            width={16}
            alt="Search icon"
            className="search-icon"
          />
          <input type="text" placeholder="Search something" className="input" />
        </div>
        <Link href={"/"}>
          <Image src={Logo} height={25} alt="Logo" className="logo" />
        </Link>
        <div className="right">
          <Image
            src={UnfilledHeart}
            height={25}
            width={25}
            alt="Search icon"
            className="search-icon"
          />
          <Link href={"/login"}>
            <button className="button">Login</button>
          </Link>
        </div>
      </HeaderStyles>
    </div>
  );
}
