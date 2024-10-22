import { redirect } from "@remix-run/node";
import { verifyToken } from "~/api/tokenAPI";
import NavbarContainer from "~/containers/NavbarContainer";

function HomePage() {
  return (
    <div>
      <NavbarContainer />
      {/* <ProductBrowser /> */}
    </div>
  );
}

export const loader = async ({ request }: { request: Request }) => {
  const resp = await verifyToken(request);
  console.log(resp.status);
  if (resp.status === 500) {
    console.log("Redirecting to /auth");
    return redirect("/auth");
  }
  return null;
};

export default HomePage;
