import styled from 'styled-components'

export const ProfileSettingsStyles = styled.div`
  .form {
    width: 500px;
  }

  .submit--buton {
    margin-top: 1rem;
    background-color: var(--dark);

    &:hover {
      background-color: var(--dark-hover);
    }
  }

  .label {
    margin-bottom: 1rem;
  }

  .button {
    width: fit-content;
  }

  .photo {
    position: relative;
    margin-top: 0.5rem;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    color: var(--dark);
    justify-content: center;

    &:hover .upload {
      opacity: 1;
    }
  }

  .photo-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: fit-content;
  }

  .photo {
    border-radius: 50%;
  }

  .upload-btn {
    background-color: transparent;
    color: var(--dark);
    padding-right: 1em;
    padding-left: 1em;
    border: 1px solid var(--stroke);
    input {
      display: none;
    }
  }
`
