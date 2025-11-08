import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GiConfirmed } from "react-icons/gi";
import Link from "next/link";
export default function Page() {
  return (
    <div className=" flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-violet-500 to-violet-800">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <GiConfirmed className="text-green-500" size={50} />
              <CardTitle className="text-2xl">
                Cảm ơn bạn đã đăng ký!
                {/* Thank you for signing up! */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={"/auth/login"} className="text-indigo-600">
                Bấm vào đây để đăng nhập
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
