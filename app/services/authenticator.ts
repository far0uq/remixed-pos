import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session";
import { UserCredentials } from "~/types/UserCredentials";

export const autheticator = new Authenticator<UserCredentials>(sessionStorage);
