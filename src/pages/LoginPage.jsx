import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (id === "test" && pw === "1234") {
      alert("로그인되었습니다.");
      navigate("/dashboard/products");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <h1 className="text-[32px] font-bold mb-8">쇼핑몰 통합 관리 플랫폼</h1>

      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full px-4 py-3 rounded border bg-gray-100"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full px-4 py-3 rounded border bg-gray-100"
        />

        {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700"
        >
          로그인
        </button>
      </form>

      <div className="w-full max-w-md flex items-center gap-4 my-6">
        <div className="flex-1 border-t border-gray-300" />
        <span className="text-sm text-gray-500">또는</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>

      <div className="w-full max-w-md text-center text-sm text-gray-500 mb-6">
        <span className="underline cursor-pointer">아이디 찾기</span> |{" "}
        <span className="underline cursor-pointer">비밀번호 찾기</span>
      </div>

      <div className="w-full max-w-md border text-center p-4 text-sm">
        계정이 없으신가요?{" "}
        <span className="text-blue-600 font-semibold cursor-pointer">가입하기</span>
      </div>
    </div>
  );
}
