import styled from "styled-components";

export const CategoriesStyles = styled.div`
  font-family: var(--font-default);
  margin-top: 2rem;
  padding: 1rem 0;
  border-top: 1px solid var(--grey-10);
  display: flex;
  align-items: center;
  gap: 4rem;

  .category {
    position: relative;
    &:hover .category-dropdown {
      opacity: 1;
      pointer-events: all;
    }
  }

  .category-name {
    font-size: 1rem;
    cursor: pointer;
  }

  .category-dropdown {
    position: absolute;
    background-color: white;
    border: 1px solid var(--grey-10);
    font-family: var(--font-default);
    border-bottom: 0;
    transition: opacity var(--transition);
    opacity: 0;
    pointer-events: none;

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
