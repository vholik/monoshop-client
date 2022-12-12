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
    width: fit-content;
  }

  .input {
    padding-left: 0.5em;
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
`;
