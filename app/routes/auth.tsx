import { useNavigation } from "@remix-run/react";
import { Form, Flex, Button } from "antd";
import { json, redirect } from "@remix-run/react";

function AuthForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const callPageAction = async () => {
    await fetch("/auth", {
      method: "POST",
    });
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100%" }}>
      <Form style={{ height: "13%", width: "15%" }}>
        <Flex style={{ height: "100%" }} justify="space-between" vertical>
          <Form.Item>
            <h4>Authorization required for Dorya Inc.</h4>
          </Form.Item>
          <Form.Item>
            <Button
              disabled={isSubmitting}
              style={{ width: "100%" }}
              type="primary"
              onClick={callPageAction}
            >
              Authorize
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
}

export const action = async () => {
  const resp = await fetch("http://localhost:5000/api/login", {
    method: "GET",
  });
  const { result } = await resp.json();
  console.log(result.url);
  if (resp.ok) {
    return redirect(result.url);
  } else {
    return json({ message: "Failed to fetch authTokenAPI" }, { status: 500 });
  }
};

export default AuthForm;
