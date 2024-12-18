import { defer, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Toaster } from "react-hot-toast";
import { getCategory, getProducts } from "~/api/productAPI";
import { verifyToken } from "~/api/tokenAPI";
import NavbarContainer from "~/containers/search/NavbarContainer";
import ProductBrowser from "~/containers/search/ProductBrowser";

function HomePage() {
  return (
    <div>
      <Toaster />
      <NavbarContainer />
      <ProductBrowser />
    </div>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const resp = await verifyToken(request);
  if (resp.status === 500) {
    console.log("Redirecting to /auth");
    return redirect("/auth");
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");

  if (cursor) {
    const resp = await getProducts(request);
    return resp;
  } else {
    const productRespPromise = getProducts(request);
    const categoryPromise = getCategory(request);

    return defer({
      productResp: productRespPromise,
      categoryResp: categoryPromise,
    });
  }
};

export default HomePage;
