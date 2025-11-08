import { getAccessToken } from "@/lib/userInfo";
import FeedbackPage from "./FeedbackPage";
async function fetchFeedbacks(accessToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phanhoi/all/customer-feedback`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("Response status:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch feedbacks");
  }
  const data = await response.json();
  console.log("Fetched feedbacks:", data);
  return data;
}
export default async function FeedbackRootPage() {
  const accessToken = await getAccessToken();
  const feedbacks = await fetchFeedbacks(String(accessToken));
  return <FeedbackPage fetchFeedbacks={feedbacks.data} accessToken={accessToken ?? ""} />;
}
