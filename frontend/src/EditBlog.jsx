// EditBlog.jsx
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/simple-image";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { authStore } from "./store/authStore";

export default function EditBlog() {
  const { user } = authStore();
  const { id } = useParams();
  const editorRef = useRef(null);
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();


  // Fetch blog content to prefill editor
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`http://localhost:5000/blogs/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setBlog(data);
    };
    fetchBlog();
  }, [id]);

  // Initialize Editor.js once data is loaded
  useEffect(() => {
    if (!blog) return;

    const editor = new EditorJS({
      holder: "editorjs",
      tools: {
        header: Header,
        list: List,
        image: ImageTool,
      },
      data: blog.content,
      onReady: () => {
        editorRef.current = editor;
      },
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [blog]);

  // Handle update
  const handleUpdate = async () => {
    const savedData = await editorRef.current.save();

    const updatedBlog = {
      title,
      username: user?.username,
      ...blog,
      content: savedData,
    };

    await fetch(`http://localhost:5000/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBlog),
    });
    toast.success("Blog updated successfully!");
    setTimeout(() => {
      navigate("/profile");
    }, 3000);
  };

  if (!blog){
   toast.loading("Loading");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Edit Blog</h2>
      <input
        type="text"
        className=" input w-full m-2 "
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div id="editorjs" className="border p-3 rounded-md"></div>

      <button
        onClick={() => {
          handleUpdate();
        }}
        className="btn btn-success mt-3 px-4 py-2"
      >
        Update Blog
      </button>
      <Toaster
        toastOptions={{
          // Define default options
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
