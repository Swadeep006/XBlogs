import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import editorjsHTML from "editorjs-html";

export default function EditorComponent() {
  const editorRef = useRef(null);
  const editorHolderRef = useRef(null);
  const [savedHTML, setSavedHTML] = useState("");

  useEffect(() => {
    if (!editorHolderRef.current) return;

    const editor = new EditorJS({
      holder: editorHolderRef.current,
      tools: {
        header: {
          class: Header,
          shortcut: "CMD+SHIFT+H",
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
              byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
            },
          },
        },
      },
    });

    editorRef.current = editor;

    return () => {
      editor.isReady.then(() => editor.destroy()).catch(() => {});
    };
  }, []);

  const handleSave = async () => {
    try {
      const outputData = await editorRef.current.save();
      console.log("Article JSON:", outputData.blocks);
      const edjsParser = editorjsHTML();
      const htmlBlocks = edjsParser.parse(outputData);
      const finalHTML = Array.isArray(htmlBlocks) ? htmlBlocks.join("") : String(htmlBlocks);
      setSavedHTML(finalHTML);
    } catch (err) {
      console.error("Saving failed:", err);
    }
  };

  return (
    <div className="p-8 ">
      <h2 className="text-xl font-semibold mb-2">Editor Demo</h2>

      {/* Editor container */}
      <div className="no-tailwind">
        <div
          id="editorjs "
          ref={editorHolderRef}
          className="rounded-lg bg-white text-black w-full h-full"
        ></div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="btn btn-primary mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Save Article
      </button>

      {/* Render saved HTML */}
      {savedHTML && (
        <div className="mt-6 p-3 border-t">
          <h3 className="text-lg font-semibold mb-2">Rendered Output:</h3>
          <div dangerouslySetInnerHTML={{ __html: savedHTML }} />
        </div>
      )}
    </div>
  );
}
