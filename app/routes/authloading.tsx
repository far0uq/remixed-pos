import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Flex, Spin, theme } from "antd";
import { handleObtainToken } from "~/api/tokenAPI";
import { getSession } from "~/services/session";

const { useToken } = theme;

function LoggingInForm() {
  const { token } = useToken();
  return (
    <Flex
      align="center"
      justify="center"
      gap="middle"
      style={{ height: "100%" }}
    >
      <h6
        style={{
          color: token.colorPrimary,
        }}
      >
        Logging you in...
      </h6>
      <br />
      <Spin size="large" />
    </Flex>
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const authCode = searchParams.get("code") as string;

  const resp = await handleObtainToken(authCode, session);

  if (resp.status === 500) {
    return redirect("/auth");
  }

  const { headers } = resp;
  const setCookieHeader = headers.get("Set-Cookie");
  return redirect("/home", {
    headers: {
      "Set-Cookie": setCookieHeader as string,
    },
  });
};

export default LoggingInForm;
