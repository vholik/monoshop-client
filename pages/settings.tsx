import Categories from "@components/Categories/Categories";
import Header from "@components/Header/Header";
import { useEffect } from "react";
import styled from "styled-components";
import ProfileSettings from "@components/ProfileSettings/ProfileSettings";
import { getProfile } from "@store/reducers/user/ProfileSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import Loading from "@components/Loading/Loading";
import Link from "next/link";
import Footer from "@components/Footer/Footer";
import { FlexPage } from "@utils/FlexStyle";

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.profileReducer.status);
  const user = useAppSelector((state) => state.profileReducer.user);

  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, []);

  return (
    <FlexPage>
      <MyProfileStyles>
        <Header />
        <Categories />
        <div className="inner">
          <div className="settings">
            <h1 className="profile-title">Settings</h1>
            <div className="settings-list">
              <Link href={"/settings"}>
                <p className="settings-list__item active">Settings</p>
              </Link>
              <Link href={"/ordered"}>
                <p className="settings-list__item">Ordered</p>
              </Link>
              <Link href={"/selling"}>
                <p className="settings-list__item">Selling</p>
              </Link>
              <Link href={"/favorites"}>
                <p className="settings-list__item">Favorites</p>
              </Link>
            </div>
          </div>
          <div className="wrapper">
            <div className="container">
              {status === "loading" ? (
                <Loading />
              ) : (
                <ProfileSettings user={user} />
              )}
            </div>
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
