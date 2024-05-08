import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return <SignIn fallbackRedirectUrl="page/select-user" signUpFallbackRedirectUrl="/page/sign-up"  />;
}