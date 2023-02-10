import styled from 'styled-components'

export const HeaderStyles = styled.div`
  padding-top: 1rem;
  display: flex;
  align-items: center;

  .input--button {
    font-size: 1rem;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 2em;
  }

  .input-wrapper {
    max-width: 350px;
    border-radius: 2em;
    display: flex;
    align-items: center;
    padding: 0 0em 0 1em;
    background-color: white;
    width: fit-content;
    width: 100%;
    border: 2px solid var(--stroke);
    margin-left: 2rem;
  }

  .input {
    padding-left: 0.5em;
    width: 95%;
    border: none;
    font-size: 1rem;
    border-radius: 2em;

    &::placeholder {
      font-size: 1rem;
      font-weight: 400;
      color: var(--dark);
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;

    .button {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  .register-btn {
    background-color: transparent;
    border: 1px solid var(--stroke);
    color: var(--dark);
  }

  .profile-wrapper {
    position: relative;
    &:hover .profile-menu {
      opacity: 1;
      pointer-events: all;
    }
  }

  .profile-image {
    background-color: #f1f1f1;
    min-height: 40px;
    min-width: 40px;
    border-radius: 6px;
  }

  .profile-menu {
    position: absolute;
    top: 2.5rem;
    right: 0;
    z-index: 5;
    background-color: var(--white);
    padding: 1.5rem 0;
    min-width: 280px;
    border-radius: 6px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition);

    .profile {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      padding: 0 1.2rem;

      .profile-image {
        min-height: 35px;
        min-width: 35px;
      }

      .profile-info {
        .profile-name {
          font-size: 1rem;
          font-weight: 500;
        }

        .profile-subname {
          font-size: 0.9rem;
          margin-top: 0.3rem;
          color: var(--grey-60);
          width: max-content;
        }
      }
    }
  }

  .link-list {
    margin-top: 1rem;

    li {
      font-size: 1.1rem;
      padding: 0.8rem 1.2rem;
      cursor: pointer;
      border-bottom: 1px solid var(--grey-10);
      transition: color var(--transition), background var(--transition);

      &:hover {
        background-color: var(--primary);
        color: var(--white);
      }
    }
  }

  .logout-btn {
    margin-top: 0.8rem;
    margin-left: 1.2rem;
    font-size: 0.9rem;
    color: var(--grey-60);
    cursor: pointer;
    width: fit-content;
  }

  .search-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cross-icon {
    cursor: pointer;
    transition: background 0.1s linear;
    border-radius: 50%;
    &:hover {
      background-color: var(--grey-10);
    }
  }

  @media screen and (max-width: 1024px) {
    .input-wrapper {
      max-width: 200px;
    }
  }

  @media screen and (max-width: 768px) {
    .input-wrapper {
      display: none;
    }

    .right .button {
      display: none;
    }
  }
`
