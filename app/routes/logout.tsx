import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/services/session";

export const action = async ({ request }: LoaderFunctionArgs) => {
  console.log("triggered logout");
  const session = await getSession(request.headers.get("Cookie"));
  const cookie = await destroySession(session);

  return redirect("/auth", {
    headers: {
      "Set-Cookie": cookie, // Clears the session
    },
  });
};
