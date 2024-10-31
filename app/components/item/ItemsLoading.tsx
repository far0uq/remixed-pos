import { Skeleton, Flex, Grid } from "antd";
import "./ItemsLoading.css";

const { useBreakpoint } = Grid;

function ItemsLoading() {
  const screens = useBreakpoint();

  return (
    <Flex
      wrap
      gap={screens.lg ? "2%" : "0%"}
      style={{ width: "100%" }}
      className="loading-bar"
    >
      <Skeleton.Button
        active={true}
        style={{
          width: "100%",
          height: 280,
          marginTop: "20px",
        }}
      />
      <Skeleton.Button
        active={true}
        style={{
          width: "100%",
          height: 280,
          marginTop: "20px",
        }}
      />
      <Skeleton.Button
        active={true}
        style={{
          width: "100%",
          height: 280,
          marginTop: "20px",
        }}
      />
      <Skeleton.Button
        active={true}
        style={{
          width: "100%",
          height: 280,
          marginTop: "20px",
        }}
      />
      <Skeleton.Button
        active={true}
        style={{
          width: "100%",
          height: 280,
          marginTop: "20px",
        }}
      />
    </Flex>
  );
}

export default ItemsLoading;
