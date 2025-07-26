import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { FaListUl } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineSearch } from "react-icons/md";
import axiosInstance from "@/api/axiosInstance";
import VariantEditModal from "./VariantEditModal";
import { FaS } from "react-icons/fa6";

export default function VariantList() {
  const [variants, setVariants] = useState([]);
  const [viewType, setViewType] = useState("list");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const size = viewType === "list" ? 10 : 12;
  const [sort, setSort] = useState("productName,asc");
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingStock, setEditingStock] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [showVariantModal, setShowVariantModal] = useState(false);

  const handleSortChange = (value) => {
    setPage(0);
    setSort(value);
  };

  const fetchVariants = async () => {
    try {
      const res = await axiosInstance.get(
        `/wholesaler/products/variants?page=${page}&size=${size}&sort=${sort}`
      );
      setVariants(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("재고 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [page, size, sort]);

  const handleStockSave = async (productId, variantId) => {
    const newStock = editingStock[variantId];
    if (newStock === undefined) return;
    setLoading(true);
    try {
      await axiosInstance.patch(`/wholesaler/products/${productId}/variants/${variantId}`, {
        stock: newStock,
      });
      setVariants((prev) => prev.map((v) => (v.id === variantId ? { ...v, stock: newStock } : v)));
      setEditingStock((prev) => {
        const updated = { ...prev };
        delete updated[variantId];
        return updated;
      });
      setEditingId(null);

      alert("재고가 변경되었습니다.");
    } catch (err) {
      console.error("재고 수정 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = variants.filter((v) => {
    const nameMatch = v.productName.toLowerCase().includes(search.toLowerCase());
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "inStock" && v.stock > 0) ||
      (statusFilter === "outOfStock" && v.stock === 0);
    return nameMatch && statusMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">재고 관리</h2>
      </div>

      <Tabs.Root value={viewType} onValueChange={setViewType}>
        <Tabs.List className="flex gap-3 mb-2">
          <Tabs.Trigger
            value="list"
            className={`flex items-center gap-1 px-2 py-1 border-b-2 ${
              viewType === "list" ? "border-black font-bold" : "text-gray-400 border-transparent"
            }`}
          >
            <FaListUl /> 리스트형
          </Tabs.Trigger>
          <Tabs.Trigger
            value="grid"
            className={`flex items-center gap-1 px-2 py-1 border-b-2 ${
              viewType === "grid" ? "border-black font-bold" : "text-gray-400 border-transparent"
            }`}
          >
            <MdOutlineDashboard /> 대시보드형
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 border px-2 text-sm"
        >
          <option value="all">전체</option>
          <option value="inStock">재고 있음</option>
          <option value="outOfStock">재고 없음</option>
        </select>

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="h-8 border px-2 text-sm"
        >
          <option value="productName,asc">상품명</option>
          <option value="stock,desc">재고순</option>
        </select>

        <div className="relative w-full max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border h-8 pl-2 pr-8 text-sm w-full"
            placeholder="검색"
          />
          <MdOutlineSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {viewType === "list" ? (
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-center">상품명</th>
              <th className="border px-3 py-2 text-center">사이즈</th>
              <th className="border px-3 py-2 text-center">컬러</th>
              <th className="border px-3 py-2 text-center w-[140px]">재고</th>
              <th className="border px-3 py-2 text-center">기능</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td className="border px-3 py-2 text-center">{v.productName}</td>
                <td className="border px-3 py-2 text-center">{v.size}</td>
                <td className="border px-3 py-2 text-center">{v.color}</td>
                <td className="border px-3 py-2 w-[140px]">
                  {editingId === v.id ? (
                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        value={editingStock[v.id] ?? v.stock}
                        onChange={(e) =>
                          setEditingStock((prev) => ({ ...prev, [v.id]: Number(e.target.value) }))
                        }
                        className="w-16 border rounded px-1 text-sm text-center h-7"
                      />
                      <button
                        onClick={() => handleStockSave(v.productId, v.id)}
                        className="ml-1 text-xs text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
                        disabled={loading}
                      >
                        완료
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="w-16 text-center">{v.stock}</span>
                      <button
                        onClick={() => setEditingId(v.id)}
                        className="ml-1 text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
                      >
                        수정
                      </button>
                    </div>
                  )}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => {
                      setSelectedProductId(v.productId);
                      setSelectedProductName(v.productName);
                      setShowVariantModal(true);
                    }}
                    className="border px-2 py-1 rounded text-sm hover:bg-gray-100"
                  >
                    재고 변경
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((v) => (
            <div key={v.id} className="border rounded p-3 text-sm">
              <h3 className="font-semibold text-sm truncate">{v.productName}</h3>
              <p className="text-xs mt-1">사이즈: {v.size}</p>
              <p className="text-xs">컬러: {v.color}</p>
              <div className="text-xs mb-2 flex items-center gap-1">
                재고:
                {editingId === v.id ? (
                  <>
                    <input
                      type="text"
                      value={editingStock[v.id] ?? v.stock}
                      onChange={(e) =>
                        setEditingStock((prev) => ({ ...prev, [v.id]: Number(e.target.value) }))
                      }
                      className="w-16 border px-1 text-sm text-right"
                    />
                    <button
                      onClick={() => handleStockSave(v.productId, v.id)}
                      className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded"
                      disabled={loading}
                    >
                      완료
                    </button>
                  </>
                ) : (
                  <>
                    <span className="ml-1">{v.stock}</span>
                    <button
                      onClick={() => setEditingId(v.id)}
                      className="text-xs text-blue-600 underline ml-1"
                    >
                      수정
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedProductId(v.productId);
                  setSelectedProductName(v.productName);
                  setShowVariantModal(true);
                }}
                className="border px-2 py-1 rounded text-sm hover:bg-gray-100"
              >
                재고 변경
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-8 h-8 rounded border text-sm ${
              page === i ? "bg-gray-200 font-bold" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showVariantModal && (
        <VariantEditModal
          productId={selectedProductId}
          productName={selectedProductName}
          onClose={() => setShowVariantModal(false)}
          onUpdate={fetchVariants}
        />
      )}
    </div>
  );
}
