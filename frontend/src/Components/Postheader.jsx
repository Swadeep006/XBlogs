import { useEffect } from "react";
import { authStore } from "../store/authStore";
export default function Postheader() {
  const { profilepic, loadprofilepic } = authStore();
  useEffect(() => {
    loadprofilepic();
  }, []);
  return (
    <>
      <div className="card bg-base-100 shadow-sm flex justify-between flex-row p-4 sm:p-8  h-fit">
        <div className="flex gap-2">
          <div className="btn btn-ghost btn-circle avatar border border-primary" >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src={`http://localhost:5000${profilepic}`}
              />
            </div>
          </div>
          <div className="hidden sm:flex font-medium text-xs sm:text-lg p-1">
            <p>Share your thoughts to flourish everywhere....</p>
          </div>
           <div className="text-md font-bold sm:hidden pt-1">
            XBlogs
          </div>
        </div>

        <a href="/newblog">
          <button className="btn btn-dash sm:text-lg ">NEW BLOG</button>
        </a>
      </div>
    </>
  );
}
