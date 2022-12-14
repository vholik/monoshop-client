import styled from "styled-components";

export const ProfileItemsStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0.5vw;
  grid-row-gap: 2vw;
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

    .item-name {
      font-weight: 700;
    }
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
`;
