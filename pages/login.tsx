import Header from "@components/Header";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";

export default function Login() {
  return (
    <LoginStyles>
      <Head>
        <title>Monoshop - Login to your account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="wrapper">
        <div className="bg"></div>
        <div className="side">
          <h1 className="title-md title">Login to your account</h1>
          <label htmlFor="#email-input" className="label">
            Your email
          </label>
          <input
            type="text"
            placeholder="Your email"
            className="input"
            id="email-input"
          />
          <label htmlFor="#password-input" className="label">
            Password
          </label>
          <input
            type="text"
            placeholder="Password"
            className="input"
            id="password-input"
          />
          <p className="account-action">
            Haven't created an account yet?{" "}
            <Link href="/register">
              <span className="link">Register</span>
            </Link>
          </p>
          <button className="button">Login</button>
        </div>
      </div>
    </LoginStyles>
  );
}

const LoginStyles = styled.div`
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    height: 100vh;
    grid-column-gap: 4rem;

    .title {
      margin-bottom: 2rem;
    }

    .bg {
      height: 100%;
      background-color: var(--grey-30);
    }

    .side {
      display: flex;
      flex-direction: column;

      .input {
        width: 20rem;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
      }

      .button {
        margin-top: 2rem;
        width: fit-content;
      }
    }

    .account-action {
      color: var(--grey-60);
      .link {
        color: var(--dark);
        text-decoration: underline;
      }
    }
  }
`;
