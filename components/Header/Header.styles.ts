import styled from "styled-components";

export const HeaderStyles = styled.div`
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .input-wrapper {
    border: 1px solid var(--dark);
    display: flex;
    align-items: center;
    padding: 0 0.5em;
    background-color: white;
    width: fit-content;
  }

  .logo {
    width: 14rem;
  }

  .input {
    padding-left: 0.5em;
    width: 15rem;
    border: none;
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
`;
