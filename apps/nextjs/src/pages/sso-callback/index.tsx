import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

function SSOCallback() {
  // Handle the redirect flow by rendering the
  // prebuilt AuthenticateWithRedirectCallback component.
  // This is the final step in the custom OAuth flow
  console.log("Calling SSO");
  return <AuthenticateWithRedirectCallback continueSignUpUrl={"/register"} />;
}

export default SSOCallback;
