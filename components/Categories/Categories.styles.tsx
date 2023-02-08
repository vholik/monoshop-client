import styled from 'styled-components'

export const CategoriesStyles = styled.div`
  font-family: var(--font-default);
  margin-top: 1rem;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -100%;
    right: -100%;
    border-top: 1px solid var(--grey-10);
  }

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
    min-width: 150px;

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
`
