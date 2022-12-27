import styled from "styled-components";

export const ProfileSettingsStyles = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;

  .form {
    background-color: white;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
    grid-area: "row";
  }

  .submit--buton {
    margin-top: 1rem;
  }

  .input {
    margin-top: 0.5rem;
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
