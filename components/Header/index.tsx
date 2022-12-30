import { HeaderStyles } from "./Header.styles";
import Image from "next/image";
import SearchIcon from "@public/images/search.svg";
import Logo from "@public/images/logo.svg";
import UnfilledHeart from "@public/images/unfilled-heart.svg";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { ChangeEvent, useEffect, useState } from "react";
import { checkIsAuth } from "@store/reducers/auth/LoginSlice";
import ChatIcon from "@public/images/chat.svg";
import UserIcon from "@public/images/user.svg";
import { setSearchValue } from "@store/reducers/filter/FilterSlice";
import { getItems } from "@store/reducers/item/GetItemsSlice";
import Router from "next/router";

export default function Header() {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.loginReducer);
  const filter = useAppSelector((state) => state.filterReducer);
  const { isItemsLoading } = useAppSelector((state) => state.getItemsReducer);

  const [value, setValue] = useState("");

  useEffect(() => {
    dispatch(checkIsAuth())
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, []);

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue(e.target.value));
  };

  const searchSubmit = () => {
    console.log(filter.search);
    if (value.length > 50) return;
    if (isItemsLoading) return;

    dispatch(getItems(filter))
      .unwrap()
      .then(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      })
      .catch((error: Error) => {
        console.error("rejected", error);
      });

    Router.push("/shop");
  };

  return (
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
        <input
          type="text"
          placeholder="Search for brand, color etc."
          className="input"
          onChange={inputHandler}
          value={filter.search}
          maxLength={50}
        />
        {!!filter.search.length && (
          <button className="button input--button" onClick={searchSubmit}>
            Search
          </button>
        )}
      </div>
      {isAuth ? (
        <div className="right">
          <Link href={"/favorites"}>
            <Image
              src={UnfilledHeart}
              height={25}
              width={25}
              alt="Search icon"
              className="search-icon"
            />
          </Link>
          <Link href={"/settings"}>
            <button className="button chat--button">
              <Image
                src={UserIcon}
                height={25}
                width={25}
                alt="Search icon"
                className="search-icon"
              />
            </button>
          </Link>
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
          <Link href={"/sell"}>
            <button className="button">Sell</button>
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
  );
}
