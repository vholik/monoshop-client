import styled from "styled-components";

export const ProfileItemsStyles = styled.div`
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

  .bar {
    margin-top: 0.5rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .edit {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;
