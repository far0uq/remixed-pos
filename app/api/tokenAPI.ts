import { getSession, commitSession } from "~/services/session";
import * as jose from "jose";
import { Session } from "@remix-run/node";

export async function handleObtainToken(
  authenticationCode: string,
  session: Session,
  headers = new Headers()
) {
  try {
    if (authenticationCode) {
      const url = `http://localhost:5000/api/access-token?code=${authenticationCode}`;
      const response = await fetch(url, {
        method: "GET",
      });

      const { result, success } = await response.json();

      if (!success) {
        throw new Error(
          "Tried but Failed to obtain token, Check the authentication code."
        );
      }

      // Save token in session here

      session.set("API", result.tokenForAPI);
      session.set("Verification", result.tokenForVerification);

      headers.append(
        "Set-Cookie",
        await commitSession(session) // Commit session to store in a cookie
      );

      return new Response(
        JSON.stringify({
          data: {
            message: "Token obtained successfully",
          },
        }),
        { headers, status: 200 }
      );
    } else {
      throw new Error(
        "No authentication code provided. Check the request body."
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
}

export const verifyToken = async (request: Request) => {
  try {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
      throw new Error("No cookies found in request.");
    }

    // Retrieve session from cookie
    const session = await getSession(cookieHeader);
    const token = session.get("Verification");

    if (!token) {
      throw new Error("Could not retrieve token from Session.");
    }

    const secret = process.env.TOKEN_SECRET as string;
    const res = await jose.jwtVerify(token, new TextEncoder().encode(secret));

    if (!res.payload) {
      throw new Error(
        "Token could not be verified. There is a discrepancy in the secret or the token is not present."
      );
    }

    return new Response(
      JSON.stringify({
        data: {
          message: "Token verified successfully",
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Token verification failed.",
      }),
      { status: 500 }
    );
  }
};
