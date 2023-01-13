import styled from "styled-components";

export const CategoriesStyles = styled.div`
  font-family: var(--font-default);
  margin-top: 2rem;
  padding: 1rem 0;
  border-top: 1px solid var(--grey-10);
  border-bottom: 1px solid var(--grey-10);
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-left: 50px;
  padding-right: 50px;
  background-color: #fbfaf9;

  .category {
    position: relative;
    &:hover .category-dropdown {
      opacity: 1;
      pointer-events: all;
    }
  }

  .category-name {
    /* color: #7e7367; */
    font-size: 1rem;
    cursor: pointer;
    font-weight: 500;
    font-family: var(--font-medium);
  }

  .category-dropdown {
    position: absolute;
    background-color: white;
    border: 1px solid var(--grey-10);
    font-size: 1rem;
    font-family: var(--font-default);
    border-bottom: 0;
    transition: opacity var(--transition);
    opacity: 0;
    pointer-events: none;
    z-index: 5;

    &__subcategory {
      cursor: pointer;
      padding: 0.8em 0.7em;
      border-bottom: 1px solid var(--grey-10);
      transition: background var(--transition);
      &:hover {
        background-color: var(--white-hover);
      }
    }
  }
`;
