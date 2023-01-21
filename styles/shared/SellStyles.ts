import styled from 'styled-components'

export const SellStyles = styled.div`
  .inner-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 2rem;
  }

  .description--label {
    grid-column: 1/4;
  }

  .submit--buton {
    margin-top: 1rem;
    grid-column: 1;
  }

  #description {
    margin-top: 0.5rem;
    grid-column: 2/4;
    resize: none;
    outline: none;
    border-radius: 0;
    border: none;
    border: 1px solid var(--grey-10);
    font-family: var(--font-default);
    font-size: 1rem;
    padding: 1.2em 1em;
    height: 10em;
  }

  .title-md {
    margin-top: 2rem;
  }

  .image-upload {
    border: 2px dotted var(--grey-30);
    width: 100%;
    display: flex;
    padding: 6px 12px;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    aspect-ratio: 1 / 1;
    cursor: pointer;

    input {
      display: none;
    }
  }

  .item-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;
    margin-top: 2rem;
    background-repeat: no-repeat;
    background-size: cover;
    &:hover .item-image__inner {
      opacity: 1;
    }

    &__inner {
      opacity: 0;
      position: absolute;
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: var(--grey-30);

      .delete--icon {
        cursor: pointer;
      }

      .drag--icon {
        cursor: grab;
      }

      .image-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4rem;
        width: 4rem;
        border-radius: 50%;
        background-color: white;

        img {
          pointer-events: none;
        }
      }
    }
  }

  .inner {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-column-gap: 2rem;
    align-items: flex-start;

    .select,
    .input {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }

  .error {
    font-size: 1rem;
    color: red;
    margin-top: 0.5rem;
  }

  .button {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
  }
`
