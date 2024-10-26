import { getSession } from "~/services/session";
import { tokenTypes } from "../types/tokenTypes";

export const getTaxes = async (req: Request) => {
  try {
    const cookieHeader = req.headers.get("Cookie");
    if (!cookieHeader) {
      throw new Error("No cookies found in request.");
    }

    const session = await getSession(cookieHeader);
    const token = session.get(tokenTypes.tokenTypeAPI);
    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }

    const resp = await fetch("http://localhost:5000/api/get-tax?type=TAX", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const { success, result } = await resp.json();
    if (!success) {
      throw new Error("Failed to fetch taxes");
    }
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error }), { status: 500 };
  }
};

export const getDiscounts = async (req: Request) => {
  try {
    const cookieHeader = req.headers.get("Cookie");
    if (!cookieHeader) {
      throw new Error("No cookies found in request.");
    }

    const session = await getSession(cookieHeader);
    const token = session.get(tokenTypes.tokenTypeAPI);
    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }

    const resp = await fetch(
      "http://localhost:5000/api/get-discounts?type=DISCOUNT",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const { success, result } = await resp.json();
    if (!success) {
      throw new Error("Failed to fetch discounts");
    }
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error }), { status: 500 };
  }
};
