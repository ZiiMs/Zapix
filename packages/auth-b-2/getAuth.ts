import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/server";

export { getAuth } from "@clerk/nextjs/server";

export interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}
