import { redirect } from "@remix-run/node";
import { verifyToken } from "~/api/tokenAPI";

function HomePage() {
  return (
    <div>
      <h1>Authentication Successful</h1>
    </div>
  );
}

export const loader = async ({ request }: { request: Request }) => {
  const resp = await verifyToken(request);
  console.log(resp.status);
  if (resp.status === 500) {
    redirect("/auth");
  }
  return null;
};

export default HomePage;
