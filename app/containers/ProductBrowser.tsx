import { Flex, Grid } from "antd";
import SearchBar from "./SearchBar";
import { Suspense, useState } from "react";
import ItemContainer from "./ItemContainer";
import ItemsLoading from "./ItemsLoading";
import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { loader } from "~/routes/auth";
import LoadingBar from "react-top-loading-bar";

const { useBreakpoint } = Grid;

function ProductBrowser() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  let { productResp } = useLoaderData<typeof loader>();
  console.log(productResp);
  const screens = useBreakpoint();

  if (navigation.state === "loading" && progress === 0) {
    setProgress(50);
  } else if (navigation.state === "idle" && progress === 50) {
    setProgress(100);
  }

  return (
    <div>
      <Flex
        gap="large"
        style={{ width: screens.sm ? "65%" : "90%", margin: "auto" }}
        vertical
      >
        <SearchBar />

        <Suspense fallback={<ItemsLoading />}>
          <Await resolve={productResp}>
            {(productResp) => {
              return <ItemContainer productResp={productResp as string} />;
            }}
          </Await>
        </Suspense>
      </Flex>
      <LoadingBar progress={progress} onLoaderFinished={() => setProgress(0)} />
    </div>
  );
}

export default ProductBrowser;
