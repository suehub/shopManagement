import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "@/api/axiosInstance";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/wholesaler/products/${id}`);
        if (res.status === 200) {
          console.log(res.data);
          setProduct(res.data);
        } else {
          setError("상품 정보를 불러오는 데 실패했습니다.");
          console.log(res.status);
        }
      } catch (err) {
        setError("상품 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("정말 이 상품을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const res = await axios.delete(`/wholesaler/products/${id}`);

      if (res.status === 200) {
        alert("상품이 삭제되었습니다.");
        navigate("/dashboard/products");
      } else {
        setError("상품 삭제에 실패했습니다.");
        console.error(res.status);
      }
    } catch (err) {
      setError("상품 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const handleChangeActive = async (isActive) => {
    try {
      const res = await axios.patch(`/wholesaler/products/${id}/is-active`, {
        active: !isActive,
      });

      if (res.status === 200) {
        const resultMessage = res.data.active
          ? "판매중으로 상태가 변경되었습니다."
          : "판매중지로 상태가 변경되었습니다.";
        alert(resultMessage);

        setProduct((prev) => ({
          ...prev,
          prodValue: {
            ...prev.prodValue,
            isActive: res.data.active,
          },
        }));
      } else {
        setError("상태 변경에 실패했습니다.");
        console.log(res.status);
      }
    } catch (err) {
      setError("상태 변경에 실패했습니다.");
      console.error(err);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>로딩 중...</div>;

  return (
    <div className="max-w-[90%] mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">상품 정보</h1>
        <div className="space-x-2">
          {product.prodValue.isActive ? (
            <button
              onClick={() => handleChangeActive(product.prodValue.isActive)}
              className="border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50"
            >
              판매중단
            </button>
          ) : (
            <button
              onClick={() => handleChangeActive(product.prodValue.isActive)}
              className="border border-red-500 text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              판매재개
            </button>
          )}
        </div>
      </div>

      <hr className="mb-6 border-black" />

      {/* 상품명 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">상품명</label>
        <input
          className="w-full border px-3 py-2 rounded bg-gray-100"
          value={product.prodValue.productName}
          readOnly
        />
      </div>

      {/* 가격 + 카테고리 */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">가격</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-100"
            value={product.prodValue.price?.toLocaleString() + "원" || "0원"}
            readOnly
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">카테고리</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-100"
            value={product.prodValue.category?.name || "-"}
            readOnly
          />
        </div>
      </div>

      <div className="flex gap-6 mb-4">
        {/* 이미지 */}
        <div>
          <label className="block mb-1 font-medium">상품 대표이미지</label>
          <div className="w-48 h-48 border flex items-center justify-center bg-gray-50 rounded overflow-hidden">
            <img
              src={product.prodValue.images?.[0]?.imgUrl || "/favicon.png"}
              alt="대표 이미지"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 색상/사이즈별 옵션 */}
        <div className="flex-1">
          <label className="block mb-1 font-medium">옵션</label>
          <div className="border rounded h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="border px-2 py-1">색상</th>
                  <th className="border px-2 py-1">사이즈</th>
                </tr>
              </thead>
              <tbody>
                {product.stockOptions?.map((opt, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1 text-center">{opt.color}</td>
                    <td className="border px-2 py-1 text-center">{opt.size}</td>
                  </tr>
                ))}
                {product.stockOptions?.map((opt, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1 text-center">{opt.color}</td>
                    <td className="border px-2 py-1 text-center">{opt.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 메모 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">메모</label>
        <input
          className="w-full border px-3 py-2 rounded bg-gray-100"
          value={product.prodValue.memo}
          readOnly
        />
      </div>

      {/* 상품 디테일 */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">상품 디테일</label>
        <textarea
          className="w-full border px-3 py-2 rounded h-32 bg-gray-100"
          value={product.prodValue.description}
          readOnly
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("edit")}
          className="px-6 py-2 border rounded hover:bg-gray-100"
        >
          수정하기
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2 border rounded text-red-600 border-red-500 hover:bg-red-50"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
