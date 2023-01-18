import Categories from "@components/Categories/Categories";
import Header from "@components/Header/Header";
import { useEffect } from "react";
import styled from "styled-components";
import ProfileItems from "@components/ProfileItems/ProfileItems";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import Link from "next/link";
import { getUserItems } from "@store/reducers/item/GetUserItemsSlice";
import Loading from "@components/Loading/Loading";
import Footer from "@components/Footer/Footer";
import { FlexPage } from "@utils/FlexStyle";
import { showErrorToast } from "@utils/ReactTostify/tostifyHandlers";

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.getUserItemsReducer.items);
  const itemsStatus = useAppSelector(
    (state) => state.getUserItemsReducer.status
  );

  const deleteStatus = useAppSelector(
    (state) => state.deleteItemReducer.status
  );

  useEffect(() => {
    dispatch(getUserItems())
      .unwrap()
      .catch((error) => {
        showErrorToast("Error displaying user items");
      });
  }, []);

  return (
    <FlexPage>
      <MyProfileStyles>
        <Header />
        <Categories />
        <div className="inner">
          <div className="settings">
            <h2 className="profile-title">Selling items</h2>
            <div className="settings-list">
              <Link href={"/settings"}>
                <p className="settings-list__item">Settings</p>
              </Link>
              <Link href={"/ordered"}>
                <p className="settings-list__item">Ordered</p>
              </Link>
              <Link href={"/selling"}>
                <p className="settings-list__item active">Selling</p>
              </Link>
              <Link href={"/favorites"}>
                <p className="settings-list__item">Favorites</p>
              </Link>
            </div>
          </div>
          <div className="wrapper">
            {itemsStatus === "loading" || deleteStatus === "loading" ? (
              <Loading />
            ) : (
              <div className="container">
                <ProfileItems items={items} />
              </div>
            )}
          </div>
        </div>
      </MyProfileStyles>
      <Footer />
    </FlexPage>
  );
};

const MyProfileStyles = styled.div`
  .inner {
    margin: 0 50px;
    display: flex;
    gap: 10rem;
  }

  .wrapper {
    width: 100%;
    margin-top: 2rem;
    height: 100%;
  }

  .profile-title {
    margin-top: 2rem;
    font-size: 2rem;
    font-weight: 600;
    width: max-content;
  }

  .settings {
    position: absolute;
    left: 50px;
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    margin-top: 1rem;
    width: max-content;

    &__item {
      cursor: pointer;
      padding: 0.8em 0.5em;
      border-radius: 0.5em;
    }

    .active {
      background-color: var(--grey-10);
    }
  }
`;

export default MyProfile;
