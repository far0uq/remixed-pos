import { cleanProductObjects } from "../utils/productHelper";
import { tokenTypes } from "../types/tokenTypes";
import { getSession } from "~/services/session";
import { formatCategories } from "~/utils/categoryHelper";

export async function getProducts(req: Request) {
  console.log("ENTERED GET PRODUCTS");
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
    console.log("AFTER TOKEN");

    const reqURL = new URL(req.url);

    let cursor = "";
    let query = reqURL.searchParams.get("query");
    query = query === "undefined" || !query ? "" : query;
    let category = reqURL.searchParams.get("category");
    category =
      category === "undefined" || category === "0" || !category ? "" : category;
    console.log(query);
    console.log(category);

    const url = `http://localhost:5000/api/search-catalog-items?textFilter=${query}&categoryId=${category}&cursor=${cursor}`;
    console.log(url);

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const { success, result } = await resp.json();
    if (!success) {
      throw new Error("Failed to fetch products");
    }

    cursor = result.cursor === "" ? null : result.cursor;

    const objects = result.items;

    if (objects) {
      const cleanedObjects = cleanProductObjects(objects);
      return JSON.stringify(cleanedObjects);
    } else {
      return JSON.stringify([]);
    }
  } catch (error) {
    console.log(error);
    return JSON.stringify([]);
  }
}

export async function getCategory(req: Request) {
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

    const response = await fetch("http://localhost:5000/api/list-categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const { result } = await response.json();
    const formattedCategories = formatCategories(result);

    return JSON.stringify(formattedCategories);
  } catch (error) {
    console.error("Error: ", error);
    return JSON.stringify([]);
  }
}
