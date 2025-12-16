import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Allblogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/blogs", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.log("Couldn't fetch blogs");
        return;
      }

      const data = await response.json();
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(sorted);
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
    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col gap-5 sm:m-5 overflow-hidden">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          onClick={() => navigate(`/blogs/${blog._id}`)}
          className="card bg-base-100 shadow-md flex-row items-center justify-between p-4 rounded-2xl cursor-pointer"
        >
          <div className="flex items-center gap-4 w-full">
            {/* <div className="w-20 h-20 rounded-xl overflow-hidden bg-yellow-100 flex items-center justify-center">
              <img
                src={blog.thumbnailurl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div> */}

            <div className="flex flex-col">
              <h2 className="text-md  sm:text-lg font-semibold">{blog.title}</h2>
              <p className="text-xs sm:text-md">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className=" w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center text-sm font-semibold">
                {blog.username ? blog.username[0].toUpperCase() : "?"}
              </div>
              <p className="text-sm">{blog.username}</p>
            </div>

            <button className="btn bg-yellow-100 border-yellow-200 text-black hover:bg-yellow-200 hidden sm:flex">
              VIEW
            </button>
          </div>
        </div>
      ))}
     
    </div>
  );
}
