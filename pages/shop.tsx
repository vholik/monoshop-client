import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import Select from "react-select";
import { filterColourStyles } from "@utils/react-select.styles";
import { useAppDispatch } from "@store/hooks/redux";
import { getItems } from "@store/reducers/item/GetItemsSlice";
import { GetServerSideProps } from "next";
import { wrapper } from "@store/reducers/store";
import { Item } from "@store/types/item";
import Image from "next/image";

interface IShopProps {
  items: Item[];
}

function Shop({ items }: IShopProps) {
  return (
    <ShopStyling>
      <Header />
      <Categories />
      <div className="container">
        <div className="wrapper">
          <div className="filter">
            <Select
              placeholder={"Styles"}
              styles={filterColourStyles}
              options={[{ value: "Hey", label: "Hey" }]}
              className="select"
              required={true}
              isDisabled={false}
              isLoading={false}
              isSearchable={true}
              name={"Hey"}
              instanceId="long-value-select"
              isClearable={true}
            />
            <Select
              placeholder={"Colour"}
              styles={filterColourStyles}
              options={[{ value: "Hey", label: "Hey" }]}
              className="select"
              required={true}
              isDisabled={false}
              isLoading={false}
              isSearchable={true}
              name={"Hey"}
              isClearable={true}
            />
          </div>
          <div className="items-wrapper">
            {items.map((item) => (
              <div className="item">
                <div className="item-image">
                  <Image
                    src={item.images[0]}
                    alt="Image"
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
                <p className="item-price">{item.price} PLN</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShopStyling>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const res = await store.dispatch(getItems());

    const items = await res.payload;

    return {
      props: {
        items,
      },
    };
  }
);

export default Shop;

const ShopStyling = styled.div`
  .wrapper {
    border-top: 1px solid var(--grey-10);
  }

  .filter {
    display: flex;
    margin-top: 1rem;
    gap: 1rem;
  }

  .items-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 2rem;
    margin-top: 1rem;

    .item {
      .item-image {
        aspect-ratio: 1 / 1.2;
        position: relative;
      }

      .item-price {
        margin-top: 0.5rem;
      }
    }
  }
`;
