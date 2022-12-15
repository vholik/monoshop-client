import { HeaderStyles } from "./Header.styles";
import Image from "next/image";
import SearchIcon from "@public/images/search.svg";
import Logo from "@public/images/logo.svg";
import UnfilledHeart from "@public/images/unfilled-heart.svg";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { useEffect } from "react";
import { checkIsAuth } from "@store/reducers/auth/LoginSlice";
import ChatIcon from "@public/images/chat.svg";

export default function Header() {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.loginReducer);

  useEffect(() => {
    dispatch(checkIsAuth())
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, []);

  return (
    <div className="container">
      <HeaderStyles>
        <Link href={"/"}>
          <Image src={Logo} height={25} alt="Logo" className="logo" />
        </Link>

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

        {isAuth ? (
          <div className="right">
            <Image
              src={UnfilledHeart}
              height={25}
              width={25}
              alt="Search icon"
              className="search-icon"
            />
            <Link href={"/chat"}>
              <button className="button chat--button">
                <Image
                  src={ChatIcon}
                  height={25}
                  width={25}
                  alt="Search icon"
                  className="search-icon"
                />
                Messages
              </button>
            </Link>
            <Link href={"/add-item"}>
              <button className="button">Add item</button>
            </Link>
          </div>
        ) : (
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
        )}
      </HeaderStyles>
    </div>
  );
}
