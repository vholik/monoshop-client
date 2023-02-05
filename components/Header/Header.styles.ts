import styled from 'styled-components'

export const HeaderStyles = styled.div`
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .input--button {
    font-size: 1rem;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 2em;
  }

  .input-wrapper {
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 0.4em 1em;
    background-color: white;
    width: fit-content;
    width: 100%;
    margin: 0 5rem;
    background-color: #f6f6f6;
    border: 1px solid var(--stroke);
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

  .right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
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
`
