import { Flex, Spin, theme } from "antd";

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

export default LoggingInForm;
