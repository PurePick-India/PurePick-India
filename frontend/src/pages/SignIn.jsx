import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignIn 
      signInUrl="/sign-in" 
      forceRedirectUrl={"/"}
      signUpUrl="/sign-up"
      />
    </div>
  );
}
