import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Blog() {
  const { BlogId } = useParams();
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [content, setContent] = useState(null);
  const [savedHTML, setSavedHTML] = useState("");

  const fetchBlogMatter = async () => {
    try {
      const response = await fetch(`http://localhost:5000/blogs/${BlogId}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.log("Error fetching blog");
        return;
      }

      const data = await response.json();
      setTitle(data.title);
      setUsername(data.username);
      setContent(data.content); // this should be EditorJS JSON
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogMatter();
  }, [BlogId]);

  // --------------------------
  // CUSTOM EDITOR.JS PARSER TO HTML
  // --------------------------
  const parseEditorJsToHTML = (data) => {
    if (!data || !data.blocks) return "";

    return data.blocks
      .map((block) => {
        switch (block.type) {
          case "header": {
            const level = block.data.level || 2;
            const text = block.data.text || "";
            return `<h${level} style="font-weight: bold; margin: 20px 0 10px 0; font-size: ${
              level === 1 ? "32px" : level === 2 ? "28px" : "24px"
            };">${text}</h${level}>`;
          }

          case "paragraph": {
            const text = block.data.text || "";
            return `<p style="margin: 10px 0; line-height: 1.6;">${text}</p>`;
          }

          case "list": {
            const style = block.data.style || "unordered";
            const listTag = style === "ordered" ? "ol" : "ul";
            const items = block.data.items || [];

            const renderItems = (itemsList) => {
              return itemsList
                .map((item) => {
                  let itemContent = "";
                  let nestedHTML = "";

                  if (typeof item === "string") {
                    itemContent = item;
                  } else if (typeof item === "object") {
                    itemContent = item.content || item.text || "";
                    if (item.items && Array.isArray(item.items) && item.items.length > 0) {
                      nestedHTML = `<${listTag} style="padding-left: 20px; margin-top: 5px;">
                        ${renderItems(item.items)}
                      </${listTag}>`;
                    }
                  }

                  return `<li style="margin: 6px 0; line-height: 1.6;">${itemContent}${nestedHTML}</li>`;
                })
                .join("");
            };

            const itemsHTML = renderItems(items);

            const listStyle =
              style === "ordered"
                ? "margin: 15px 0; padding-left: 30px; list-style-type: decimal;"
                : "margin: 15px 0; padding-left: 30px; list-style-type: disc;";

            return `<${listTag} style="${listStyle}">${itemsHTML}</${listTag}>`;
          }

          case "checklist": {
            const items = block.data.items || [];

            const checklistHTML = items
              .map((item) => {
                const text = item.text || "";
                const checked = item.checked === true;

                return `
                  <label style="display: flex; align-items: flex-start; margin: 10px 0;">
                    <input 
                      type="checkbox" 
                      ${checked ? "checked" : ""} 
                      onclick="return false;"
                      style="margin-right: 12px; width: 20px; height: 20px; accent-color: #4CAF50;" 
                    />
                    <span style="${checked ? "text-decoration: line-through; color: #888;" : "color: #333;"}">
                      ${text}
                    </span>
                  </label>
                `;
              })
              .join("");

            return `<div style="margin: 15px 0;">${checklistHTML}</div>`;
          }

          case "table": {
            const hasHeadings = block.data.withHeadings || false;
            const content = block.data.content || [];

            if (content.length === 0) return "";

            const rows = content
              .map((row, rowIndex) => {
                const cells = row
                  .map((cell) => {
                    const tag = hasHeadings && rowIndex === 0 ? "th" : "td";
                    const style =
                      hasHeadings && rowIndex === 0
                        ? "border: 1px solid #ddd; padding: 12px; background: #f5f5f5; font-weight: bold;"
                        : "border: 1px solid #ddd; padding: 12px;";
                    return `<${tag} style="${style}">${cell || ""}</${tag}>`;
                  })
                  .join("");
                return `<tr>${cells}</tr>`;
              })
              .join("");

            return `<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
              <tbody>${rows}</tbody>
            </table>`;
          }

          default:
            return "";
        }
      })
      .join("");
  };

  useEffect(() => {
    if (content) {
      const html = parseEditorJsToHTML(content); // use custom parser
      setSavedHTML(html);
    }
  }, [content]);

  return (
    <div className="m-8 p-5 border rounded-lg shadow w-full mx-auto">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: savedHTML }}
      />

      <div className="flex justify-end text-gray-600 mt-4">~ {username}</div>
    </div>
  );
}
