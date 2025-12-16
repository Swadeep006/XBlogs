import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { authStore } from "./store/authStore";
export default function Profile() {
  const { user, loadUser, loadTheme } = authStore();
  const [myblogs, Setmyblogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadTheme();
  }, []);

  const fetchmyblogs = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:5000/myblogs?username=${user.username}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        console.log("error", response.status);
      }
      const data = await response.json();
      Setmyblogs(data);
    } catch (error) {
      console.log(error);
    }
  };
  const senddeleteblog = async (deleteId) => {
    try {
      const response = await fetch(`http://localhost:5000/blogs/${deleteId}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        toast.success("Blog deleted!");
        setTimeout(() => {
          Setmyblogs((prev) => prev.filter((blog) => blog._id !== deleteId));
        }, 2000);
      } else {
        console.log("Error deleting blog");
        toast.error("Couldn't delete blog");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    let formatted = date.toLocaleString("en-US", options);

    // Remove the space before AM/PM
    formatted = formatted.replace(" AM", "AM").replace(" PM", "PM");

    // Replace comma with middle dot
    formatted = formatted.replace(", ", " · ");

    return formatted;
  };

  useEffect(() => {
    if (user) {
      fetchmyblogs();
    }
  }, []);
  return (
    <div className="flex flex-col gap-5 m-2 sm:m-5 overflow-hidden">
      {myblogs.length === 0 ? (
        <p className="text-2xl font-semibold text-gray-500 text-center">
          You have no blogs posted yet!
        </p>
      ) : (
        <div className="flex flex-col gap-5 w-full">
          {myblogs.map((blog) => (
            <div
              key={blog._id}
              className="card bg-base-100 shadow-md flex-row items-center justify-between p-4 rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex flex-col">
                  <h2 className="text-md hidden sm:flex sm:text-lg font-semibold">
                    {blog.title}
                  </h2>
                  {/* for mobile */}
                  <h2 className="text-md underline sm:text-lg font-semibold sm:hidden" onClick={() => navigate(`/blogs/${blog._id}`)} >
                    {blog.title}
                  </h2>
                  <p className="text-xs sm:text-md">
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-6 ">
                <button
                  className="btn btn-accent btn-sm sm:btn-md text-white hidden sm:flex"
                   onClick={() => navigate(`/blogs/${blog._id}`)}
                >
                  VIEW
                </button>
                <button
                  className="btn btn-sm sm:btn-md"
                  onClick={() => navigate(`/edit/${blog._id}`)}
                >
                  EDIT
                </button>
                <button
                  className="btn btn-error btn-sm sm:btn-md text-white "
                  onClick={() => senddeleteblog(blog._id)}
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Toaster
        toastOptions={{
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
