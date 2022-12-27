import ReactLoading from "react-loading";
import { LoadingStyles } from "./Loading.styles";

export default function Loading() {
  return (
    <LoadingStyles>
      <ReactLoading type={"cubes"} color={"#282828"} height={100} width={100} />
    </LoadingStyles>
  );
}
