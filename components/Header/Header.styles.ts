import styled from "styled-components";

export const HeaderStyles = styled.div`
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 50px;
  padding-right: 50px;

  .cross-icon {
    cursor: pointer;
    transition: background 0.1s linear;
    border-radius: 50%;
    &:hover {
      background-color: var(--grey-10);
    }
  }

  .input--button {
    font-size: 0.9rem;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 2em;
  }

  .input-wrapper {
    border-radius: 2em;
    /* border: 1px solid var(--dark); */
    display: flex;
    align-items: center;
    padding: 0 1em;
    background-color: white;
    width: fit-content;
    width: 100%;
    margin: 0 5rem;
    background-color: #f5f5f5;
  }

  .logo {
    width: 14rem;
  }

  .input {
    padding-left: 0.5em;
    width: 100%;
    border: none;
    background-color: #f5f5f5;

    &::placeholder {
      color: #ccc !important;
    }
  }

  .search-icon {
    pointer-events: none;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .chat--button {
    background-color: transparent;
    color: var(--dark);
    padding: 0;
  }

  .search-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
