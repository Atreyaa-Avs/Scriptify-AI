import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "./MenuBar";
import Highlight from "@tiptap/extension-highlight";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { TextSelect, X } from "lucide-react";
import UploadPng from "/upload.png";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { Toggle } from "./ui/toggle";
import {
  Bold,
  Italic,
  Strikethrough,
  PenTool,
  ArrowUpFromLine,
  SendHorizonal,
} from "lucide-react";

import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { saveAs } from "file-saver";

const TiptapEditorForHandwritingtoText = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [uploadFiletoBackend, setUploadFiletoBackend] = useState(null);

  // Handle drag overlay
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      setShowOverlay(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (
        e.relatedTarget === null ||
        !document.body.contains(e.relatedTarget)
      ) {
        setShowOverlay(false);
      }
    };

    const handleDrop = () => setShowOverlay(false);

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadFiletoBackend(file);
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-3" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-3" } },
      }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: "Write something cool..." }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ HTMLAttributes: { class: "bg-yellow-300" } }),
    ],
    editorProps: {
      attributes: { class: "bg-white border-none" },
    },
    content:
      sessionStorage.getItem("editorContent2") ||
      "<p>Handwriting To Text..!</p>",
    onUpdate: ({ editor }) => {
      sessionStorage.setItem("editorContent2", editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to);
        setSelectedText(text);
      }
    },
  });

  const handleSubmit = async () => {
    if (!uploadFiletoBackend) return;

    const formData = new FormData();
    formData.append("file", uploadFiletoBackend);

    const loadingToast = toast.loading("Processing...");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const extractedText = response.data.extracted_text;
      console.log("Extracted Text:", extractedText);

      if (editor && extractedText) {
        editor.chain().focus().insertContent(`\n\n${extractedText}\n`).run();
      } else {
        console.warn("Editor not available or text missing");
      }
      toast.success("Success...!!");
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.error("Failed to get Response.");
      toast.dismiss(loadingToast);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUploadFiletoBackend(null);
  };

  const handleExportToWord = () => {
    if (!editor) return;

    const htmlContent = editor.getHTML();

    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Export</title>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;

    const blob = new Blob(["\ufeff", wordHtml], {
      type: "application/msword;charset=utf-8",
    });

    saveAs(blob, "editor-content.doc");
  };

  return (
    <div {...getRootProps()} className="relative pt-1">
      <Toaster />

      {showOverlay && (
        <div className="fixed top-0 left-0 w-full h-screen z-50 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl">
          <img src={UploadPng} alt="Upload" className="w-20 mr-4" />
          Drop the file here...
        </div>
      )}

      <div className="h-[200vh] flex mx-auto bg-[#525252] p-6 gap-6">
        {/* Left panel */}
        <div className="flex flex-col w-[20%] max-md:w-[30%]">
          <div className="text-center text-2xl font-bold text-white underline mt-4">
            Handwriting To Text
          </div>

          <div className="h-fit flex flex-col gap-4 bg-neutral-400 p-4 rounded-md mt-4 items-center justify-center w-full sticky top-5">
            <input {...getInputProps()} hidden />

            <p className="text-md text-center">
              {isDragActive ? (
                "Drop the file here..."
              ) : (
                <>
                  Drag or upload a file here
                  <br />
                  <span className="text-red-500 text-sm">
                    (only .jpeg, .jpg, .png files)
                  </span>
                </>
              )}
            </p>

            <Button onClick={open} className="w-full" disabled={!!uploadedFile}>
              Upload File
            </Button>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!uploadedFile}
            >
              Submit
            </Button>

            {uploadedFile && (
              <div className="relative text-sm mt-2 w-full text-left bg-white p-2 rounded">
                <button
                  onClick={clearFile}
                  className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
                <p>
                  <strong>File:</strong> {uploadedFile.name}
                </p>
                <p>
                  <strong>Type:</strong> {uploadedFile.type}
                </p>
                <p>
                  <strong>Size:</strong> {uploadedFile.size} MB
                </p>
              </div>
            )}
            <Button onClick={handleExportToWord}>
              <ArrowUpFromLine /> Export to Word (.doc)
            </Button>
          </div>
        </div>

        {/* Editor panel */}
        <div className="editor-container flex flex-col p-4 flex-1 bg-white rounded-md">
          <MenuBar editor={editor} />
          <div className="border rounded-md flex-1 overflow-y-auto">
            <EditorContent
              editor={editor}
              className="w-full h-full min-h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:p-4"
            />
            {editor && (
              <div>
                <CustomBubbleMenu editor={editor} selectedText={selectedText} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomBubbleMenu = ({ editor, selectedText }) => {
  if (!editor) return null;

  const [input, setInput] = useState("");

  const handleTranslation = ({ language }) => {
    const task = `Translation ${language}`;
    handleSubmit(task);
    setInput("");
  };

  const handleSubmit = async (task) => {
    if (!task) return;

    const postData = axios.post("http://localhost:3000/api/AI", {
      task: task,
      Data: selectedText,
    });

    toast.promise(postData, {
      loading: "Processing...",
      success: (res) => {
        console.log("Response ", res.data.response);
        if (editor) {
          editor.commands.insertContent(res.data.response); // Insert the AI response into the editor
        }
        return "Success!";
      },
      error: "Failed to get response from AI.",
    });
  };

  const Options = [
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <PenTool className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <BubbleMenu
      className="bubble-menu bg-neutral-400 rounded-md w-fit p-2 relative"
      tippyOptions={{
        duration: 100,
        interactive: true,
        placement: "bottom",
      }}
      editor={editor}
    >
      <div className="bg-slate-500 rounded-md flex justify-center">
        {Options.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
          >
            <div>{option.icon}</div>
          </Toggle>
        ))}
      </div>
      <div>
        <p>Selected Text:</p>
        <div className="text-sm bg-stone-300 p-2 rounded-md mb-2 text-pretty">
          <p className="text-center">
            {selectedText.length > 30
              ? `${selectedText.slice(0, 30)}.....${selectedText.slice(
                  selectedText.length - 20,
                  selectedText.length - 1
                )}.`
              : selectedText}
          </p>
        </div>
      </div>
      <div>
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="flex gap-2">
            <Button onClick={() => handleSubmit("Summarization")}>
              <TextSelect /> Summarize
            </Button>
            <div className="">
              <input
                type="text"
                value={input}
                className="bg-black text-white focus:outline-none p-2 rounded-md text-sm"
                placeholder="Translate to.."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTranslation({ language: input });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </BubbleMenu>
  );
};

export default TiptapEditorForHandwritingtoText;
