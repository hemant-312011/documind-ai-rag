import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col text-slate-800 transition-colors dark:text-slate-100">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
