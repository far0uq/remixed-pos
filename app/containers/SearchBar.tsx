import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Row, Col, Input, Select, Tooltip, Button, Form, Skeleton } from "antd";
import { Await, useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "~/routes/auth";
import { CategoryFormatted } from "~/interface/CategoryInterface";
import { Suspense } from "react";
import CategoriesLoading from "./CategoriesLoading";

function SearchBar() {
  const { categoryResp } = useLoaderData<typeof loader>();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const lastQuery = "";
  const lastCategory = "";

  interface SearchFormat {
    query: string;
    category: string;
  }

  const handleSaveQuery = (values: SearchFormat) => {
    const query = lastQuery;
    const category = lastCategory;
    const params = new URLSearchParams();
    if (values.query !== query) params.set("query", values.query);
    if (values.category !== category) params.set("category", values.category);

    setSearchParams(params, {
      preventScrollReset: true,
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleSaveQuery}
      style={{
        marginTop: "20px",
      }}
    >
      <Row
        style={{ width: "100%", margin: "auto" }}
        gutter={{ xs: 7, sm: 7, lg: 7 }}
      >
        <Col xs={24} sm={15}>
          <Form.Item name="query">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              suffix={
                <Tooltip title="Search Up Particular Items">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={{ span: 4, offset: 1 }} lg={{ span: 3, offset: 3 }}>
          <Form.Item name="category">
            <Suspense
              fallback={<CategoriesLoading  />}
            >
              <Await resolve={categoryResp}>
                {(categoryResp: string) => {
                  const categoryData = JSON.parse(categoryResp);
                  return (
                    <Select
                      defaultValue="Category"
                      options={categoryData.map(
                        (category: CategoryFormatted) => ({
                          label: category.label,
                          value: category.value,
                        })
                      )}
                      style={{ width: "100%" }}
                    />
                  );
                }}
              </Await>
            </Suspense>
          </Form.Item>
        </Col>
        <Col xs={12} sm={4} lg={3}>
          <Form.Item>
            <Button
              type="primary"
              style={{ width: "100%" }}
              htmlType="submit"
              // onClick={() => {
              // const params = new URLSearchParams();
              // params.set("someKey", "someValue");
              // setSearchParams(params, {
              // preventScrollReset: true,
              // });
              // }}
            >
              Search
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;
