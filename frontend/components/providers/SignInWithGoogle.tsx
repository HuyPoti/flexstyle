import React from "react";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
function SignInWithGoogle() {
  const [isLoading, setIsLoading] = useState(false);
  const { OauthLogin } = useAuth();
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await OauthLogin("gg");
      // PhanQuyenLink(role || "KH");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <FaGoogle />
      {isLoading ? "Redirecting..." : "Login with Google"}
    </Button>
  );
}

export default SignInWithGoogle;
