import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "./MenuBar";
import Highlight from "@tiptap/extension-highlight";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import UploadPng from "/upload.png";

const TiptapEditorForTexttoHandwriting = () => {
  const [charCount, setCharCount] = useState(0);
  const limit = 1000;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),

      Placeholder.configure({ placeholder: "Write something cool..." }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        HTMLAttributes: {
          class: "hover:bg-yellow-500",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "bg-white border-nonew",
      },
    },
    content:
      sessionStorage.getItem("editorContent") ||
      "<p>Text To Handwriting...!</p>",
    onUpdate: ({ editor }) => {
      sessionStorage.setItem("editorContent", editor.getHTML());
    },
  });

  return (
    <div className="h-[200vh] flex flex-col max-w-4xl mx-auto p-4">
      <MenuBar editor={editor} />
      <div className="border rounded-md flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="w-full h-full min-h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:p-4"
        />
      </div>
      {}
    </div>
  );
};

export default TiptapEditorForTexttoHandwriting;
