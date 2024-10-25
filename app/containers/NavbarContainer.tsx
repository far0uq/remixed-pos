import { useState } from "react";
import { Button, Divider, Row, Col, Grid, Drawer, Image } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import WebsiteLogo from "../../public/doryabooks.svg";
import { useFetcher } from "@remix-run/react";
import CartContainer from "./cart/CartContainer";
import { useTotalStore } from "~/store/store";

const { useBreakpoint } = Grid;

function NavbarContainer() {
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const cartLength = useTotalStore((state) => state.cartLength);

  const fetcher = useFetcher();

  const openDrawer = () => {
    if (!fetcher.data && cartLength > 0) fetcher.load("/modifiers");
    setOpen(true);
  };
  const closeDrawer = () => setOpen(false);

  const handleLogout = async () => {
    const resp = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.redirected) {
      window.location.replace(resp.url);
    }
  };

  return (
    <>
      <Row
        style={{
          width: screens.sm ? "65%" : "90%",
          margin: "20px auto auto auto",
        }}
      >
        <Col xs={12} sm={8} lg={10}>
          <Image
            style={{ paddingTop: "10px" }}
            width={230}
            src={WebsiteLogo}
            alt="Logo"
            preview={false}
          />
        </Col>
        <Col
          xs={{ span: 4, offset: 4 }}
          sm={{ span: 2, offset: 11 }}
          lg={{ span: 1, offset: 11 }}
        >
          <Button type="text" style={{ width: "100%" }} onClick={openDrawer}>
            <ShoppingCartOutlined
              style={{
                fontSize: 30,
              }}
            />
          </Button>
          <Drawer
            onClose={closeDrawer}
            open={open}
            closable={screens.sm ? false : true}
            width={"500px"}
          >
            <CartContainer fetcher={fetcher} />
          </Drawer>
        </Col>
        <Col
          xs={{ span: 4 }}
          sm={{ span: 2, offset: 1 }}
          lg={{ span: 2, offset: 0 }}
        >
          <Button
            type="text"
            style={{
              width: "100%",
              fontWeight: "bolder",
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Col>
      </Row>
      <Divider style={{ marginTop: "20px" }} />
    </>
  );
}

export default NavbarContainer;
