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
import { getOrders } from "@store/reducers/order/getOrdersSlice";

const Ordered = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.getOrdersReducer.status);
  const items = useAppSelector((state) => state.getOrdersReducer.items);

  useEffect(() => {
    dispatch(getOrders())
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => console.log("rejected", err));
  }, []);

  console.log(items);

  return (
    <FlexPage>
      <OrderedStyles>
        <Header />
        <Categories />
        <div className="container">
          <div className="settings">
            <h2 className="profile-title">Ordered clothing</h2>
            <div className="settings-list">
              <Link href={"/settings"}>
                <p className="settings-list__item">Settings</p>
              </Link>
              <Link href={"/ordered"}>
                <p className="settings-list__item active">Ordered</p>
              </Link>
              <Link href={"/selling"}>
                <p className="settings-list__item">Selling</p>
              </Link>
              <Link href={"/favorites"}>
                <p className="settings-list__item">Favorites</p>
              </Link>
            </div>
          </div>
        </div>
        {status === "loading" ? (
          <Loading />
        ) : (
          <div className="container">
            <div className="items-inner">
              {/* {!items.length && (
                <h2 className="no-items">You haven't ordered anything.</h2>
              )}

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
                      <div className="item-price">{item.price} PLN</div>
                    </div>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        )}
      </OrderedStyles>
      <Footer />
    </FlexPage>
  );
};

export default Ordered;

const OrderedStyles = styled.div`
  .items-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 0.5vw;
    grid-row-gap: 2vw;
    margin-top: 2rem;

    .item {
      aspect-ratio: 1/1;

      .item-image {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .item-price {
        font-weight: 700;
      }
    }

    .hero {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
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
