import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { getFavorites } from "@store/reducers/favorite/GetFavoriteSlice";
import Link from "next/link";
import { useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Loading from "@components/Loading/Loading";

const Favorites = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector(
    (state) => state.getFavoriteReducer
  );

  useEffect(() => {
    dispatch(getFavorites())
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => console.log("rejected", err));
  }, []);

  console.log(items);

  return (
    <FavoritesStyles>
      <Header />
      <Categories />
      <div className="container">
        <h2 className="profile-title">My profile</h2>
        <div className="settings-list">
          <Link href={"/settings"}>
            <p className="settings-list__item">Profile settings</p>
          </Link>
          <Link href={"/my-items"}>
            <p className="settings-list__item">My items</p>
          </Link>
          <Link href={"/my-items"}>
            <p className="settings-list__item active">My favorites</p>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="wrapper">
          <div className="container">
            <div className="items-inner">
              {items.map((item) => (
                <div className="item" key={item.id}>
                  <div className="item-image">
                    <Link href={`shop/${item.id}`}>
                      <Image
                        src={item.images[0]}
                        alt="Photo"
                        fill
                        objectFit="cover"
                      />
                    </Link>
                  </div>
                  <div className="bar">
                    <div className="hero">
                      <div className="item-name">{item.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </FavoritesStyles>
  );
};

export default Favorites;

const FavoritesStyles = styled.div`
  .items-inner {
    background-color: white;
    padding-top: 2rem;
    padding-bottom: 2rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 2rem;

    .item {
      aspect-ratio: 1/1;

      .item-image {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }

    .hero {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .bar {
      margin-top: 0.5rem;
      font-size: 1.1rem;

      .edit {
        margin-top: 0.5rem;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .wrapper {
    background-color: white;
    width: 100%;
    margin-top: 2rem;
    height: 100%;
  }

  .profile-title {
    margin-top: 2rem;
    font-size: 3rem;
    font-weight: 600;
  }

  .settings-list {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    font-size: 1.2rem;

    &__item {
      cursor: pointer;
    }

    .active {
      font-weight: 600;
      text-decoration: underline;
    }
  }
`;
