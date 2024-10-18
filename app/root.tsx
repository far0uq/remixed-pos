import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { ConfigProvider } from "antd";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#8b4d0b",
          colorSuccess: "#0069fc",
          colorWarning: "#f5222d",
          colorError: "#ff0004",
          borderRadius: 4,
          boxShadow: "none",
          fontFamily: "'Satoshi', sans-serif",
        },
        components: {
          Button: {
            paddingBlock: 22,
          },
          Select: {
            controlHeight: 46,
          },
          Input: {
            paddingInline: 24,
            controlHeight: 46,
          },
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
}
