import { Skeleton } from "antd";

function CategoriesLoading() {
  return (
    <Skeleton.Input
      active={true}
      size={"large"}
      block={true}
      style={{ width: "100%" }}
    />
  );
}

export default CategoriesLoading;
