import Categories from "@components/Categories/Categories";
import Header from "@components/Header/Header";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { getFavorites } from "@store/reducers/favorite/GetFavoriteSlice";
import Link from "next/link";
import { useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Loading from "@components/Loading/Loading";
import Footer from "@components/Footer/Footer";
import { FlexPage } from "@utils/FlexStyle";
import { showErrorToast } from "@utils/ReactTostify/tostifyHandlers";
import Profile from "@components/Profile/Profile";
import Favorites from "@components/Favorites/Favorites";

const FavoritesPage = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.getFavoriteReducer.status);
  const items = useAppSelector((state) => state.getFavoriteReducer.items);

  useEffect(() => {
    dispatch(getFavorites())
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => showErrorToast("Can not load favorites"));
  }, []);

  return (
    <Profile isLoading={status === "loading" || status === "init"}>
      <Favorites items={items} />
    </Profile>
  );
};

export default FavoritesPage;
