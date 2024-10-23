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
  console.log(resp.status);
  if (resp.status === 500) {
    console.log("Redirecting to /auth");
    return redirect("/auth");
  }

  const timeout = 2000;

  const products = await getProducts(request);
  const productRespPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, timeout);
  });

  const categoryPromise = getCategory(request);

  return defer({
    productResp: productRespPromise,
    categoryResp: categoryPromise,
  });
};

export default HomePage;
