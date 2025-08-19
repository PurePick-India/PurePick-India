import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignUp signUpUrl="/sign-up" 
      forceRedirectUrl={"/"}
      signInUrl="/sign-in"
      />
    </div>
  );
}
