import React from "react";
import SupplierPage from "./SupplierMangePage";
import { getAccessToken, getUserId } from "@/lib/userInfo";

async function getPhieuNhap() {
  const token = await getAccessToken();
  const userId = await getUserId();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/ncc/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.json();
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

async function page() {
  const phieuNhap = await getPhieuNhap();
  console.log("phieuNhap data:", phieuNhap);

  return <SupplierPage initData={phieuNhap.data} />;
}

export default page;
