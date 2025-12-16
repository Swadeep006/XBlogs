import { useEffect } from "react";
import { authStore } from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, logout, profilepic, loadprofilepic } = authStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/");
  };
  useEffect(() => {
    loadprofilepic();
  }, []);

  const isActive = (path) => location.pathname === path;
  return (
    <div className="navbar bg-base-100 shadow-sm h-screen w-1/4 sm:mr-2 hidden sm:flex flex-col p-8 justify-between">
      {/* --- Logo Section --- */}
      <div className="flex flex-col items-center">
        <a className="text-2xl font-bold" href="/home">
          X BLOGS
        </a>
        {/* <p>Hi, {user.username}</p> */}
      </div>

      {/* --- Navigation Links --- */}
      <div className="flex flex-col text-center gap-y-4 text-md h-1/2 font-bold">
        <button
          onClick={() => navigate("/home")}
          className={`p-2 rounded-lg ${
            isActive("/home")
              ? "btn btn-neutral px-8 font-bold text-md text-white shadow-md"
              : ""
          }`}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`p-2 rounded-lg ${
            isActive("/profile")
              ? "btn btn-neutral px-6 font-bold text-md text-white shadow-md"
              : ""
          }`}
        >
          PROFILE
        </button>

        <button
          onClick={() => navigate("/settings")}
          className={`p-2 rounded-lg ${
            isActive("/settings")
              ? "btn btn-neutral px-6 font-bold text-md text-white shadow-md"
              : ""
          }`}
        >
          SETTINGS
        </button>
      </div>

      {/* --- User Info + Logout --- */}
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-2 items-center">
          <div className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={`http://localhost:5000${profilepic}`}
              />
            </div>
          </div>
          <div className="p-2 font-semibold">{user?.username || "Guest"}</div>
        </div>

        <button className="btn btn-neutral text-sm" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>
    </div>
  );
}
