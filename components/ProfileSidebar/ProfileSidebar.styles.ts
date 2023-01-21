import styled from "styled-components";

export const ProfileSidebarStyles = styled.div`
  width: fit-content;

  .title-sm {
    margin-bottom: 1rem;
  }

  .profile-route {
    cursor: pointer;
    padding: 0.8em 1em;
    border-radius: 0.5rem;
    transition: background 0.2s linear;

    &:hover {
      background-color: var(--grey-5);
    }
  }

  .active-route {
    background-color: var(--grey-10);
  }
`;
