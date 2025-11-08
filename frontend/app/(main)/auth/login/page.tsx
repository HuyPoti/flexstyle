import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className=" flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-violet-500 to-violet-800">
      <LoginForm />
    </div>
  );
}
