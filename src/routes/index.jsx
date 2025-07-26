import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProductCreate from "../components/product/ProductCreate";
import ProductList from "../components/product/ProductList";
import ProductDetail from "../components/product/ProductDetail";
import ProductEdit from "../components/product/ProductEdit";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 루트 로그인 */}
        <Route path="/" element={<LoginPage />} />

        {/* 로그인 이후 dashboard 이동 */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="products">
            <Route index element={<ProductList />} />
            <Route path="create" element={<ProductCreate />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path=":id/edit" element={<ProductEdit />} />
          </Route>
          <Route path="orders" element={<div className="text-xl font-bold">주문/발송 관리</div>} />
          <Route path="inbound" element={<div className="text-xl font-bold">입고 관리</div>} />
          <Route path="returns" element={<div className="text-xl font-bold">반품 관리</div>} />
          <Route path="inventory" element={<div className="text-xl font-bold">재고 관리</div>} />
          <Route path="samples" element={<div className="text-xl font-bold">샘플 요청 관리</div>} />
          <Route path="settlement" element={<div className="text-xl font-bold">정산 관리</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
