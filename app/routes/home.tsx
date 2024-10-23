import { defer, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCategory, getProducts } from "~/api/productAPI";
import { verifyToken } from "~/api/tokenAPI";
import NavbarContainer from "~/containers/NavbarContainer";
import ProductBrowser from "~/containers/ProductBrower";

function HomePage() {
  return (
    <div>
      <NavbarContainer />
      <ProductBrowser />
    </div>
  );
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const resp = await verifyToken(request);
  console.log(resp.status);
  if (resp.status === 500) {
    console.log("Redirecting to /auth");
    return redirect("/auth");
  }

  const timeout = 3000;

  const query = params.get("query") || "";
  const category = params.get("category") || "";
  
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
