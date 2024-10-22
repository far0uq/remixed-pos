import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "hellfirecookie", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.SESSION_SECRET as string], // replace this with an actual secret
    maxAge: 60 * 60 * 24,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
