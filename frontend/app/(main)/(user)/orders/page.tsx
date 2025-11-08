import OrdersPage from "./OrderPage";
async function getOrder() {
  // Fetch order data here if needed
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donhang/all`, {
    cache: "no-store",
  });
  console.log("Fetched order data:", response);
  const data = await response.json();
  return data;
}
export default async function MainPage() {
  const orderData = await getOrder();
  console.log("Order data in layout:", orderData.data);
  return (
    <OrdersPage initialOrderData={orderData.data} />
  );
}
