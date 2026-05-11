import React from "react";
import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/";

  return (
    <React.Suspense fallback={<div>Loading login form...</div>}>
      <LoginForm callbackUrl={callbackUrl} />
    </React.Suspense>
  );
}
