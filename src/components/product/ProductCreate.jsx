import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axiosInstance";

const ProductCreate = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [, setImageFile] = useState(null);
  const [sizes, setSizes] = useState(["Free"]);
  const [colors, setColors] = useState(["기본"]);
  const [form, setForm] = useState({
    productName: "",
    price: 0,
    categoryId: 1,
    memo: "",
    description: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleImageDelete = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleAdd = (type) => {
    type === "size" ? setSizes([...sizes, ""]) : setColors([...colors, ""]);
  };

  const handleRemove = (type, idx) => {
    const updated = type === "size" ? [...sizes] : [...colors];
    updated.splice(idx, 1);
    type === "size" ? setSizes(updated) : setColors(updated);
  };

  const handleChange = (type, idx, value) => {
    const updated = type === "size" ? [...sizes] : [...colors];
    updated[idx] = value;
    type === "size" ? setSizes(updated) : setColors(updated);
  };

  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const base64Image = imagePreview?.split(",")[1] || "";

      const payload = {
        prodValue: {
          productName: form.productName,
          category: {
            id: Number(form.categoryId),
            name: "",
          },
          price: Number(form.price),
          isSmplAva: true,
          memo: form.memo,
          description: form.description,
          images: [
            {
              id: 0,
              imgUrl: base64Image,
              sortOrder: 0,
            },
          ],
          detailBlocks: [],
        },
        sizes: sizes.join(","),
        colors: colors.join(","),
      };

      const res = await axios.post("/wholesaler/products", payload);
      if (res.status === 200) {
        const productId = res.data.productId;
        navigate(`/dashboard/products/${productId}`);
        alert("상품이 등록되었습니다.");
        console.log(res.data);
      } else {
        alert("상품 등록에 실패하였습니다. 다시 시도해주세요.");
        console.log(res.status);
      }
    } catch (error) {
      console.error(error);
      alert("상품 등록에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">상품 등록</h1>
      <hr className="mb-6 border-black" />

      {/* 상품명 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">상품명</label>
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="상품명을 입력하세요"
          value={form.productName}
          onChange={(e) => handleFormChange("productName", e.target.value)}
        />
      </div>

      {/* 이미지 + 가격/카테고리 */}
      <div className="flex gap-6 mb-4">
        {/* 이미지 */}
        <div>
          <label className="block mb-1 font-medium">상품 대표이미지</label>
          <label
            htmlFor="imageUpload"
            className="cursor-pointer w-48 h-48 border flex items-center justify-center bg-gray-50 rounded overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <div className="text-gray-400 text-sm">업로드</div>
            )}
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="text-center mt-2 space-x-4 text-sm">
              <label htmlFor="imageUpload" className="text-blue-600 underline cursor-pointer">
                변경
              </label>
              <button onClick={handleImageDelete} className="text-red-500 underline cursor-pointer">
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 가격 / 카테고리 */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">가격</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={form.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">카테고리</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={form.categoryId}
                onChange={(e) => handleFormChange("categoryId", e.target.value)}
              >
                <option value="1">상의</option>
                <option value="2">아우터</option>
                <option value="3">바지</option>
                <option value="4">치마</option>
                <option value="5">원피스</option>
                <option value="6">세트</option>
                <option value="7">액세서리</option>
                <option value="8">신발</option>
              </select>
            </div>
          </div>

          {/* 사이즈 */}
          <div>
            <label className="block font-medium mb-1">
              사이즈 <span className="text-blue-600 text-sm">(+ 버튼으로 추가)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, idx) => (
                <div key={idx} className="flex gap-1">
                  <input
                    className="border px-2 py-1 rounded w-24"
                    value={size}
                    onChange={(e) => handleChange("size", idx, e.target.value)}
                  />
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemove("size", idx)}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="text-blue-500" onClick={() => handleAdd("size")}>
                +
              </button>
            </div>
          </div>

          {/* 컬러 */}
          <div>
            <label className="block font-medium mb-1">
              컬러 <span className="text-blue-600 text-sm">(+ 버튼으로 추가)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, idx) => (
                <div key={idx} className="flex gap-1">
                  <input
                    className="border px-2 py-1 rounded w-24"
                    value={color}
                    onChange={(e) => handleChange("color", idx, e.target.value)}
                  />
                  {colors.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemove("color", idx)}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="text-blue-500" onClick={() => handleAdd("color")}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메모 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">메모</label>
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="예: 기본, A업체 발주"
          value={form.memo}
          onChange={(e) => handleFormChange("memo", e.target.value)}
        />
      </div>

      {/* 상품 디테일 */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">상품 디테일</label>
        <textarea
          className="w-full border px-3 py-2 rounded h-32"
          value={form.description}
          onChange={(e) => handleFormChange("description", e.target.value)}
        />
      </div>

      {/* 등록 버튼 */}
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default ProductCreate;
