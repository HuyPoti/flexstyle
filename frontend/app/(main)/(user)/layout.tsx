import ProtectedRoute from "@/components/protected-route";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoute Role={"KH"}>{children}</ProtectedRoute>;
}
