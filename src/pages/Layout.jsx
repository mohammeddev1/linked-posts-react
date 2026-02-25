import { Navigate, Outlet } from "react-router-dom";
import TheNavbar from "../components/TheNavbar";

export default function Layout() {
  return (
    <>
      <TheNavbar />
      <div className="container mt-8 max-w-7xl mx-auto p-5 md:p-0">
        <Outlet />
      </div>
    </>
  );
}
