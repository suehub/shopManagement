import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { MdOutlineDashboard, MdOutlineSearch } from "react-icons/md";
import { FaListUl } from "react-icons/fa";

const dummyProducts = [
  {
    id: 1,
    name: "루즈핏 셔츠",
    image: "",
    sizes: ["S", "M", "L"],
    colors: ["블랙", "화이트"],
    price: 24000,
    stock: 38,
    status: "판매중",
  },
  {
    id: 2,
    name: "아띠 베이직 반팔 후드",
    image: "",
    sizes: ["Free"],
    colors: ["아이보리", "베이지", "그린", "블랙", "퍼플", "핑크"],
    price: 22000,
    stock: 102,
    status: "판매중",
  },
  {
    id: 3,
    name: "에르 체크 BL",
    image: "",
    sizes: ["Free"],
    colors: ["소라", "블랙"],
    price: 23000,
    stock: 302,
    status: "판매중",
  },
  {
    id: 4,
    name: "쇼냐 퀴스티에 BL",
    image: "",
    sizes: ["Free"],
    colors: ["핑크", "아이보리", "블랙"],
    price: 22000,
    stock: 192,
    status: "판매중지",
  },
  {
    id: 5,
    name: "루즈핏 셔츠",
    image: "",
    sizes: ["S", "M", "L"],
    colors: ["블랙", "화이트"],
    price: 24000,
    stock: 38,
    status: "판매중",
  },
  {
    id: 6,
    name: "아띠 베이직 반팔 후드",
    image: "",
    sizes: ["Free"],
    colors: ["아이보리", "베이지", "그린", "블랙", "퍼플", "핑크"],
    price: 22000,
    stock: 102,
    status: "판매중",
  },
  {
    id: 7,
    name: "에르 체크 BL",
    image: "",
    sizes: ["Free"],
    colors: ["소라", "블랙"],
    price: 23000,
    stock: 302,
    status: "판매중",
  },
  {
    id: 8,
    name: "쇼냐 퀴스티에 BL",
    image: "",
    sizes: ["Free"],
    colors: ["핑크", "아이보리", "블랙"],
    price: 22000,
    stock: 192,
    status: "판매중지",
  },
];

export default function ProductList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState("list");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const itemsPerPage = viewType === "grid" ? 8 : 6;

  const filteredProducts = dummyProducts.filter((p) => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "on" && p.status === "판매중") ||
      (filter === "off" && p.status === "판매중지");
    return matchName && matchFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price") return b.price - a.price;
    if (sort === "stock") return b.stock - a.stock;
    return b.id - a.id; // 최신순
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pagedProducts = sortedProducts.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">상품 목록</h2>
        <button
          onClick={() => navigate("create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          상품 등록
        </button>
      </div>

      {/* 탭 */}
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

      {/* 필터, 정렬, 검색 */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-8 border px-2 text-sm"
        >
          <option value="all">전체</option>
          <option value="on">판매중</option>
          <option value="off">판매중지</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-8 border px-2 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="price">가격순</option>
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

      {/* 목록 */}
      {viewType === "list" ? (
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-center">이미지</th>
              <th className="border px-3 py-2 text-center">상품명</th>
              <th className="border px-3 py-2 text-center">사이즈</th>
              <th className="border px-3 py-2 text-center">컬러</th>
              <th className="border px-3 py-2 text-center">가격</th>
              <th className="border px-3 py-2 text-center">상태</th>
              <th className="border px-3 py-2 text-center">기능</th>
            </tr>
          </thead>
          <tbody>
            {pagedProducts.map((product) => (
              <tr key={product.id}>
                <td className="border px-3 py-2 text-center">
                  <img src={product.image || "/favicon.png"} className="w-12 h-12 mx-auto" />
                </td>
                <td className="border px-3 py-2 text-center">{product.name}</td>
                <td className="border px-3 py-2 text-center">{product.sizes.join(", ")}</td>
                <td className="border px-3 py-2 text-center">{product.colors.join(", ")}</td>
                <td className="border px-3 py-2 text-center">{product.price.toLocaleString()}원</td>
                <td className="border px-3 py-2 text-center">
                  {product.status === "판매중" ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      판매중
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                      판매중지
                    </span>
                  )}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => navigate(`/dashboard/products/${product.id}`)}
                    className="border px-2 py-1 rounded text-sm hover:bg-gray-100"
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {pagedProducts.map((product) => (
            <div key={product.id} className="border rounded p-3 text-sm">
              <img
                src={product.image || "/favicon.png"}
                alt={product.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-xs truncate">{product.name}</h3>
              <p className="text-[11px] text-gray-500 truncate">
                {product.sizes.join(", ")} / {product.colors.join(", ")}
              </p>
              <p className="text-xs mt-1">{product.price.toLocaleString()}원</p>
              <span
                className={`inline-block text-[11px] mt-1 px-2 py-0.5 rounded text-white ${
                  product.status === "판매중" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {product.status}
              </span>
              <p className="text-[11px] mt-0.5">재고: {product.stock}</p>
              <div className="mt-2">
                <button
                  onClick={() => navigate(`/dashboard/products/${product.id}`)}
                  className="border text-xs px-2 py-1 rounded hover:bg-gray-100 w-full"
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded border text-sm ${
              currentPage === i + 1 ? "bg-gray-200 font-bold" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
