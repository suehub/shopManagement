import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-white p-6 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
}
