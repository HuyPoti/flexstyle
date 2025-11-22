import EmailMarketingAdmin from "./EmailMarketing";
async function fetchMailMarketing() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emailmarketing`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch email marketing data");
    }
    const result = await response.json();
    console.log("Fetched email marketing result:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error fetching email marketing data:", error);
    return null;
  }
}
export default async function BusinessRootPage() {
  const emailMarketingData = await fetchMailMarketing();
  return <EmailMarketingAdmin emailMarketing={emailMarketingData} />;
}
