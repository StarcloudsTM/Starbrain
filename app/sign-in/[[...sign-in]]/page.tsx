"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import SigninForm from "@/components/ui/shared/SigninForm";

const Signin = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [clerkError, setClerkError] = useState<string>(""); // Explicitly typed
  const router = useRouter();

  const signInWithEmail = async ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }): Promise<void> => { // Specify return type
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.log(result);
      }
    } catch (err) {
      if (err instanceof Error) { // Check for error instance
        console.log(JSON.stringify(err, null, 2));
        setClerkError(err.message); // Adjust based on the error structure
      } else {
        setClerkError("An unexpected error occurred."); // Fallback error message
      }
    }
  };

  return (
    <>
      <SigninForm signInWithEmail={signInWithEmail} clerkError={clerkError} />
    </>
  );
};

export default Signin;
