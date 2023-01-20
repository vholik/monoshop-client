import styled from "styled-components";

export const FavoritesStyles = styled.div`
  width: 100%;

  .items-inner {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 0.5vw;

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
`;
