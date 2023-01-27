import styled from 'styled-components'

export const OrderStyles = styled.div`
  border-top: 1px solid var(--stroke);
  padding: 1rem 0;
  width: 100%;
  color: var(--dark);
  display: grid;
  align-items: center;
  grid-template-columns: repeat(6, 1fr);

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

  .order-info {
    &:nth-child(6) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .review-button {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`
