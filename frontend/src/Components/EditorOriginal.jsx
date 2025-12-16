import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import toast, { Toaster } from "react-hot-toast";
import { authStore } from "../store/authStore";

export default function EditorOriginal() {
  const user = authStore((state) => state.user);
  const editorRef = useRef(null);
  const editorHolderRef = useRef(null);
  const [title, setTitle] = useState("");
  const Navigate = useNavigate();

  useEffect(() => {
    if (!editorHolderRef.current || editorRef.current) return;

    editorRef.current = new EditorJS({
      holder: editorHolderRef.current,
      placeholder: "Start typing...",

      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        table: {
          class: Table,
          inlineToolbar: true,
        },
        inlineCode: {
          class: InlineCode,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:5000/uploadFile",
              byUrl: "http://localhost:5000/fetchUrl",
            },
          },
        },
      },
    });

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      const outputData = await editorRef.current.save();

      if (!title.trim() && outputData.blocks.length === 0) {
        toast.error("Please enter a title or some content!");
        return;
      }

      const response = await fetch("http://localhost:5000/newblog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.username,
          title: title,
          content: outputData,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to upload blog!");
        return;
      }

      toast.success("Blog uploaded successfully!");
      setTimeout(() => Navigate("/profile"), 3000);
    } catch (err) {
      console.error("Saving failed:", err);
      toast.error("Something went wrong while saving!");
    }
  };

  return (
    <div className="p-8 items-center">
      <h2 className="text-xl font-semibold mb-2">Enter Title</h2>
      <input
        type="text"
        className="input w-full mb-4"
        placeholder="Type Here"
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Editor Only */}
      <div className="no-tailwind">
        <div
          ref={editorHolderRef}
          className="rounded-lg text-black w-full min-h-[300px] border p-4 bg-white"
        ></div>
      </div>

      <button onClick={handleSave} className="btn btn-accent mt-3 px-4 py-2 mb-8 sm:mb-0 w-full sm:w-fit">
        Publish Blog
      </button>

      <Toaster
        toastOptions={{
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
