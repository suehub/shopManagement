import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export default function VariantEditModal({ productId, productName, onClose, onUpdate }) {
  const [variants, setVariants] = useState([]);
  const [updatedStocks, setUpdatedStocks] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchVariants = async () => {
    try {
      const res = await axiosInstance.get(`/wholesaler/products/${productId}/variants`);
      setVariants(res.data.prodVariants);
      const initialStocks = {};
      res.data.prodVariants.forEach((v) => {
        initialStocks[v.id] = v.stock;
      });
      setUpdatedStocks(initialStocks);
    } catch (err) {
      console.error("변형 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    if (productId) fetchVariants();
  }, [productId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        prodStocks: variants.map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          stock: updatedStocks[v.id],
        })),
      };
      await axiosInstance.patch(`/wholesaler/products/${productId}/variants`, payload);
      alert("재고가 성공적으로 수정되었습니다.");
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error("재고 수정 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-1">재고 수정</h2>
        <p className="text-m font-bold text-blue-800 mb-4 truncate">{productName}</p>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {variants.map((v) => (
            <div key={v.id} className="flex justify-between items-center border-b pb-2">
              <span className="text-sm">
                {v.size} / {v.color}
              </span>
              <input
                type="text"
                className="border w-20 px-2 py-1 text-sm text-right"
                value={updatedStocks[v.id] ?? ""}
                onChange={(e) =>
                  setUpdatedStocks((prev) => ({
                    ...prev,
                    [v.id]: Number(e.target.value),
                  }))
                }
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
