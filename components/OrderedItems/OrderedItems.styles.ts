import styled from "styled-components";

export const OrderedItemsStyles = styled.div`
  margin-right: 50px;
  width: 100%;
  .bar,
  .order {
    border-top: 1px solid var(--stroke);
    padding: 1rem 0;
    width: 100%;
    color: var(--grey-60);
    display: grid;
    align-items: center;
    grid-template-columns: repeat(6, 1fr);
  }

  .link {
    cursor: pointer;
    color: var(--field-highlight);
  }

  .status {
    position: relative;
    width: fit-content;
    padding: 0.6em 1em;

    .status-bg {
      opacity: 0.1;
      border-radius: 4px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  .order {
    color: var(--dark);

    .order-info {
      &:nth-child(6) {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .order-settings {
    position: relative;
    padding-left: 2rem;

    .order-tab {
      border-radius: 4px;
      border: 1px solid var(--stroke);
      top: 25px;
      right: 0;
      position: absolute;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s linear;

      .order-tab__item {
        background-color: white;
        width: max-content;
        padding: 0.8em 1em;
        cursor: pointer;

        &:hover {
          background-color: #f6f6f6;
        }
      }
    }

    &:hover .order-tab {
      opacity: 1;
      pointer-events: all;
    }
  }
`;
