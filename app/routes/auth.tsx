import { useLoaderData, redirect } from "@remix-run/react";
import { Form, Flex, Button } from "antd";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { getSession } from "~/services/session";

function AuthForm() {
  const url = useLoaderData() as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openURL = () => {
    if (!isSubmitting) setIsSubmitting(true);
    toast.loading("Authorizing...", {
      style: {
        fontSize: "20px",
      },
    });
    window.location.replace(url);
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Toaster />
      <Form method="post" style={{ height: "13%", width: "15%" }}>
        <Flex style={{ height: "100%" }} justify="space-between" vertical>
          <Form.Item>
            <h4>Authorization required for Dorya Inc.</h4>
          </Form.Item>
          <Form.Item>
            <Button
              disabled={isSubmitting}
              style={{ width: "100%" }}
              type="primary"
              onClick={openURL}
              htmlType="submit"
            >
              Authorize
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
}

export const loader = async () => {
  const session = await getSession();
  if (session && session.data.length > 0) {
    return redirect("/home");
  }
  const resp = await fetch("http://localhost:5000/api/login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { result } = await resp.json();
  return result.url as string;
};

export function ErrorBoundary() {
  return (
    <div>
      <h1>Something went wrong</h1>
    </div>
  );
}

export default AuthForm;
