import styled from "styled-components";

export const ProfileSettingsStyles = styled.div`
  .status {
    grid-column: 1;
  }

  .form {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 2rem;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 2rem;
    height: fit-content;

    &:nth-child(2) {
      grid-column: 2/4;
      .label {
        grid-column: 1/3;
      }
    }
  }

  .submit--buton {
    margin-top: 1rem;
  }

  .input {
    margin-top: 0.5rem;
  }

  .button {
    grid-column: 1;
    width: fit-content;
  }

  .photo {
    position: relative;
    cursor: pointer;
    margin-top: 0.5rem;
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    color: var(--dark);
    justify-content: center;

    &:hover .upload {
      opacity: 1;
    }

    .upload {
      opacity: 0;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      background-color: var(--grey-60);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      cursor: pointer;

      input {
        display: none;
      }
    }
  }
`;
