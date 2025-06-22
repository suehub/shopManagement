import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-white p-6">
        <Outlet />
      </main>
    </div>
  );
}
