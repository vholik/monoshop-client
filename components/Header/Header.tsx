import { HeaderStyles } from "./Header.styles";
import Image from "next/image";
import SearchIcon from "@public/images/search.svg";
import Logo from "@public/images/logo.svg";
import UnfilledHeart from "@public/images/unfilled-heart.svg";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { ChangeEvent, useEffect, useState } from "react";
import { checkIsAuth } from "@store/reducers/auth/AuthSlice";
import ChatIcon from "@public/images/chat.svg";
import UserIcon from "@public/images/user.svg";
import Cross from "@public/images/cross.svg";
import { filterActions } from "@store/reducers/filter/FilterSlice";
import Router from "next/router";

export default function Header() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.authReducer.status);
  const filter = useAppSelector((state) => state.filterReducer);

  const [value, setValue] = useState("");

  useEffect(() => {
    // Set store search value to input
    if (filter.search) {
      setValue(filter.search);
    }
  }, []);

  const clearSearch = () => {
    setValue("");
    dispatch(filterActions.setSearchValue(""));
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (!e.target.value) {
      dispatch(filterActions.setSearchValue(""));
    }
  };

  const searchSubmit = () => {
    if (value.length > 50) return;

    if (value === filter.search) return;

    dispatch(filterActions.resetFilter());
    dispatch(filterActions.setSearchValue(value));

    Router.push("/shop");
  };

  return (
    <HeaderStyles>
      <Link href={"/"}>
        <Image
          src={Logo}
          alt="Logo"
          className="logo"
          draggable={false}
          height={30}
        />
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
          value={value}
          maxLength={50}
        />
        {!!value.length && (
          <div className="search-buttons">
            <Image
              src={Cross}
              height={25}
              width={25}
              alt="Cross"
              className="cross-icon"
              onClick={clearSearch}
            />
            <button className="button input--button" onClick={searchSubmit}>
              Search
            </button>
          </div>
        )}
      </div>
      {authStatus === "authenticated" ? (
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
