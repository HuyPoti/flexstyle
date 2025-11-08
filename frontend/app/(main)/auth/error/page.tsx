import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdErrorOutline } from "react-icons/md";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className=" flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-violet-500 to-violet-800">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <MdErrorOutline
                className="text-red-500 text-center inline"
                size={50}
              />
              <CardTitle className="text-2xl">
                Xin lỗi, đã có lỗi xảy ra!
                {/* Sorry, something went wrong. */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Code error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
