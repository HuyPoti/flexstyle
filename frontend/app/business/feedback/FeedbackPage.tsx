"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search} from "lucide-react";
import { Input } from "@/components/ui/input";
import FeedbackTable from "@/components/business/FeedbackTable";
import { Filter as FilterIcon } from "lucide-react";
import { PhanHoiForNV } from "@/lib/types";
import { toast } from "react-toastify";

// const initialFeedbacks = [
// 	{
// 		id: "FB001",
// 		createdAt: new Date().toISOString(),
// 		updatedAt: new Date().toISOString(),
// 		customerAccountId: "KH001",
// 		productId: "SP001",
// 		rating: 5,
// 		comment: "Sản phẩm rất tốt, giao hàng nhanh.",
// 	},
// 	{
// 		id: "FB002",
// 		createdAt: new Date().toISOString(),
// 		updatedAt: new Date().toISOString(),
// 		customerAccountId: "KH002",
// 		productId: "SP002",
// 		rating: 4,
// 		comment: "Chất lượng ổn, nhưng đóng gói chưa tốt.",
// 	},
// ];

export default function FeedbackPage({ fetchFeedbacks, accessToken }: { fetchFeedbacks: PhanHoiForNV[], accessToken: string }) {
	const [feedbacks, setFeedbacks] = useState<PhanHoiForNV[]>([]);
	const [query, setQuery] = useState("");
	const [starFilter, setStarFilter] = useState<number | null>(null);

    useEffect(() => {
        setFeedbacks(fetchFeedbacks);
    }, [fetchFeedbacks]);
    

	const handleDelete = async (id?: string) => {
        if (!id) return;
        console.log("Deleting feedback with id:", id);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phanhoi/delete?MaPH=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (response.ok) {
            toast.success("Xóa phản hồi thành công");
            setFeedbacks((prev) => prev.filter((f) => f.MaPH !== id));
        }
        else {  
            toast.error("Xóa phản hồi không thành công");
        }
	};
	
	// Lọc đánh giá dựa trên từ khóa tìm kiếm và bộ lọc số sao
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return Array.isArray(feedbacks) ? feedbacks.filter((f) => {
			if (starFilter !== null) {
				if (typeof f.SoSao !== 'number' || f.SoSao !== starFilter) return false;
			}
			if (!q) return true;
			return (
				(f.MaTKKH ?? "").toLowerCase().includes(q) ||
				(f.SANPHAM?.TenSP ?? "").toLowerCase().includes(q) ||
				(f.BinhLuan ?? "").toLowerCase().includes(q)
			);
		}) : [];
	}, [feedbacks, query, starFilter]);

	return (
		<div className="p-6">
			<div className="mb-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4 w-full max-w-2xl">
						<div className="relative w-full max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm" className="pl-10 bg-muted border-0 w-full" />
						</div>
					</div>

					<div className="flex items-center">
						<div className="relative">
							<FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<select
								value={starFilter ?? ""}
								onChange={(e) => setStarFilter(e.target.value ? Number(e.target.value) : null)}
								className="w-48 pl-9 pr-3 py-2 border rounded-md bg-transparent"
							>
								<option value="">Tất cả</option>
								<option value="5">5</option>
								<option value="4">4</option>
								<option value="3">3</option>
								<option value="2">2</option>
								<option value="1">1</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<FeedbackTable feedbacks={filtered} onDelete={handleDelete} />
		</div>
	);
}
