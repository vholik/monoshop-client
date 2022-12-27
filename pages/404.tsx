import styled from "styled-components";
import ErrorIllustration from "@public/images/404.png";
import ArrowLeft from "@public/images/arrow-left.svg";
import Image from "next/image";
import Link from "next/link";

export default function Error() {
  return (
    <ErrorStyling>
      <div className="image">
        <Image
          src={ErrorIllustration}
          alt="Error"
          style={{ position: "absolute", objectFit: "contain" }}
          fill
        />
      </div>
      <h1 className="error-text">
        Houston we got a problem... Updating your cordinates directions to the
        motherpage in 3...2... 1.
      </h1>
      <Link href={"/"}>
        <div className="return">
          <Image src={ArrowLeft} alt="Arrow" />
          Return to home page
        </div>
      </Link>
    </ErrorStyling>
  );
}

export const ErrorStyling = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .image {
    position: relative;
    width: 300px;
    height: 300px;
  }

  .error-text {
    width: 50%;
    text-align: center;
    font-size: 1.5rem;
  }

  .return {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
