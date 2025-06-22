import { NavLink, useNavigate } from "react-router-dom";
import {
  MdInventory,
  MdLocalShipping,
  MdMoveToInbox,
  MdUndo,
  MdStorage,
  MdDescription,
  MdAttachMoney,
  MdCheck,
} from "react-icons/md";

const menus = [
  { label: "상품 관리", path: "/dashboard/products", icon: MdInventory },
  { label: "주문/발송 관리", path: "/dashboard/orders", icon: MdLocalShipping },
  { label: "입고 관리", path: "/dashboard/inbound", icon: MdMoveToInbox },
  { label: "반품 관리", path: "/dashboard/returns", icon: MdUndo },
  { label: "재고 관리", path: "/dashboard/inventory", icon: MdStorage },
  { label: "샘플 요청 관리", path: "/dashboard/samples", icon: MdDescription },
  { label: "정산 관리", path: "/dashboard/settlement", icon: MdAttachMoney },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-72 h-screen bg-[#111C44] text-white py-8">
      <h1 className="text-[32px] text-center font-bold mb-1">VIDOVIDA</h1>
      <p
        className="text-[16px] text-center mb-6 underline cursor-pointer hover:text-blue-300"
        onClick={handleLogout}
      >
        로그아웃
      </p>

      <nav className="flex flex-col gap-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <NavLink key={menu.path} to={menu.path}>
              {({ isActive }) => (
                <div
                  className={`flex items-center justify-between text-[18px] my-1 py-3 px-8 hover:bg-white/10 ${
                    isActive ? "bg-white/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={20} />
                    <span className="pl-2">{menu.label}</span>
                  </div>

                  {isActive && <MdCheck size={20} />}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto text-center text-sm text-gray-300 pt-6">
        <p className="pb-2">
          <span className="underline">공지사항</span> / <span className="underline">고객 센터</span>
        </p>
        <p>(주) 쇼핑몰 통합 관리 플랫폼</p>
      </div>
    </aside>
  );
}
