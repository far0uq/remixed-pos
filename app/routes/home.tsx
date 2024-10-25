import { defer, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCategory, getProducts } from "~/api/productAPI";
import { verifyToken } from "~/api/tokenAPI";
import NavbarContainer from "~/containers/NavbarContainer";
import ProductBrowser from "~/containers/ProductBrowser";

function HomePage() {
  return (
    <div>
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
