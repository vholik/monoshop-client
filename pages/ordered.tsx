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
import { getOrders } from "@store/reducers/order/getOrdersSlice";
import Profile from "@components/Profile/Profile";
import { showErrorToast } from "@utils/ReactTostify/tostifyHandlers";
import OrderedItems from "@components/OrderedItems/OrderedItems";
import Layout from "@components/Layout/Layout";

const Ordered = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.getOrdersReducer.status);
  // const orders = useAppSelector((state) => state.getOrdersReducer.orders);
  const orders: any = [];

  useEffect(() => {
    dispatch(getOrders())
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => showErrorToast("Can not load your ordered items"));
  }, []);

  return (
    <Profile
      isLoading={status === "loading" || status === "init"}
      // isError={status === "error"}
      isError={false}
    >
      <OrderedItems items={orders} />
    </Profile>
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
