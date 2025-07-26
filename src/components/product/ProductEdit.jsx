import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "@/api/axiosInstance";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [, setImageFile] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState({
    productName: "",
    price: 0,
    categoryId: 1,
    memo: "",
    description: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/wholesaler/products/${id}`);
        if (res.status === 200) {
          const data = res.data;
          setForm({
            productName: data.prodValue.productName,
            price: data.prodValue.price,
            categoryId: data.prodValue.category?.id,
            memo: data.prodValue.memo,
            description: data.prodValue.description,
          });
          setImagePreview(data.prodValue.images?.[0]?.imgUrl || null);
          setSizes(
            data.stockOptions?.map((s) => s.size).filter((v, i, arr) => arr.indexOf(v) === i)
          );
          setColors(
            data.stockOptions?.map((c) => c.color).filter((v, i, arr) => arr.indexOf(v) === i)
          );
        } else {
          alert("상품 수정에 실패하였습니다.");
          console.log(res);
        }
      } catch (err) {
        alert("상품 수정에 실패하였습니다.");
        console.error("상품 수정 실패", err);
      }
    };

    fetchProduct();
  }, [id]);

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

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const base64Image = imagePreview?.startsWith("data:image")
        ? imagePreview.split(",")[1]
        : null;

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
          images: base64Image
            ? [
                {
                  id: 0,
                  imgUrl: base64Image,
                  sortOrder: 0,
                },
              ]
            : [],
          detailBlocks: [],
        },
        sizes: sizes.join(","),
        colors: colors.join(","),
      };

      const res = await axios.put(`/wholesaler/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        alert("상품이 수정되었습니다.");
        navigate(`/dashboard/products/${id}`);
      } else {
        alert("상품 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("정말 이 상품을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.delete(`/wholesaler/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        alert("상품이 삭제되었습니다.");
        navigate("/dashboard/products");
      } else {
        alert("상품 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">상품 수정</h1>
      <hr className="mb-6 border-black" />

      {/* 상품명 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">상품명</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={form.productName}
          onChange={(e) => handleFormChange("productName", e.target.value)}
        />
      </div>

      {/* 이미지 + 가격/카테고리 */}
      <div className="flex gap-6 mb-4">
        {/* 이미지 업로드 및 미리보기 */}
        <div>
          <label className="block mb-1 font-medium">대표 이미지</label>
          <label
            htmlFor="imageUpload"
            className="cursor-pointer w-48 h-48 border flex items-center justify-center bg-gray-50 rounded overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <div className="text-gray-400 text-sm">이미지 업로드</div>
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
            <label className="block font-medium mb-1">사이즈</label>
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
            <label className="block font-medium mb-1">컬러</label>
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
          value={form.memo}
          onChange={(e) => handleFormChange("memo", e.target.value)}
        />
      </div>

      {/* 상세 설명 */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">상품 디테일</label>
        <textarea
          className="w-full border px-3 py-2 rounded h-32"
          value={form.description}
          onChange={(e) => handleFormChange("description", e.target.value)}
        />
      </div>

      {/* 버튼 */}
      <div className="text-right space-x-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          수정하기
        </button>
        <button
          onClick={handleDelete}
          className="border border-red-500 text-red-600 px-6 py-2 rounded hover:bg-red-50"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default ProductEdit;
