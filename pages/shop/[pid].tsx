import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import { getItemById } from "@store/reducers/item/GetItemByIdSlice";
import { wrapper } from "@store/reducers/store";
import { Item } from "@store/types/item";
import { useRouter } from "next/router";
import styled from "styled-components";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const pid = query.pid as string;
      const item = await (await store.dispatch(getItemById(pid))).payload;

      if (!item) {
        return {
          props: {
            item: {},
          },
        };
      }

      return {
        props: {
          item,
        },
      };
    }
);

interface IShopItem {
  item: Item;
}

const ShopItem = ({ item }: IShopItem) => {
  console.log(item);

  return (
    <ShopItemStyles>
      <Header />
      <Categories />
      <div className="wrapper"></div>
    </ShopItemStyles>
  );
};

const ShopItemStyles = styled.div``;

export default ShopItem;
