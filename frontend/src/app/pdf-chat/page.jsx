"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pdfChats, setPdfChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  const addFiles = (selectedFiles) => {
    const newChats = selectedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      progress: 0,
      uploaded: false,
      messages: [
        {
          sender: "assistant",
          text: `Hello! Ask me anything about "${file.name}".`,
        },
      ],
    }));

    setPdfChats((prev) => [...prev, ...newChats]);

    if (!currentChat) {
      setCurrentChat(newChats[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length) {
      addFiles(files);
    }
  };

  const deleteChat = (id) => {
    const updated = pdfChats.filter((chat) => chat.id !== id);

    setPdfChats(updated);

    if (currentChat?.id === id) {
      setCurrentChat(updated.length ? updated[0] : null);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPdfChats((prev) =>
        prev.map((chat) => {
          if (chat.progress >= 100) return chat;

          const p = Math.min(chat.progress + 10, 100);

          const updated = {
            ...chat,
            progress: p,
            uploaded: p === 100,
          };

          if (
            currentChat &&
            currentChat.id === updated.id &&
            currentChat.progress !== updated.progress
          ) {
            setCurrentChat(updated);
          }

          return updated;
        }),
      );
    }, 400);

    return () => clearInterval(timer);
  }, [currentChat]);

  const sendMessage = () => {
    if (!message.trim()) return;
    if (!currentChat?.uploaded) return;

    const updatedChat = {
      ...currentChat,
      messages: [
        ...currentChat.messages,
        {
          sender: "user",
          text: message,
        },
        {
          sender: "assistant",
          text: "This is a demo response. Connect your LangGraph backend here.",
        },
      ],
    };

    setCurrentChat(updatedChat);

    setPdfChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)),
    );

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Sidebar */}

      <aside
        className={`transition-all duration-300 border-r border-slate-700 bg-slate-900 ${
          sidebarOpen ? "w-72" : "w-0"
        } overflow-hidden flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700">
          <h2 className="font-semibold text-lg">Chats History</h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pdfChats.length === 0 && (
            <div className="text-center text-slate-400 mt-10">
              No PDFs uploaded
            </div>
          )}

          {pdfChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`cursor-pointer rounded-xl border p-3 transition ${
                currentChat?.id === chat.id
                  ? "border-cyan-400 bg-slate-800"
                  : "border-slate-700 bg-slate-900 hover:bg-slate-800"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-cyan-400">
                    description
                  </span>

                  <div>
                    <p className="text-sm font-medium truncate w-40">
                      {chat.name}
                    </p>

                    <p className="text-xs text-slate-400">{chat.progress}%</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                </button>
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-700">
                <div
                  className="h-2 rounded-full bg-cyan-400"
                  style={{
                    width: `${chat.progress}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-950">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 hover:bg-slate-800"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            )}

            <Link
              href="/comparison"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-300"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>
              Back to Home
            </Link>
          </div>
        </header>
        {/* Chat Area */}

        <div className="flex-1 flex flex-col overflow-hidden">
          {!currentChat ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full max-w-3xl rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition ${
                  isDragging
                    ? "border-cyan-400 bg-slate-900"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept=".pdf"
                  onChange={(e) => addFiles(Array.from(e.target.files || []))}
                />

                <span className="material-symbols-outlined text-7xl text-cyan-400">
                  cloud_upload
                </span>

                <h2 className="mt-6 text-3xl font-bold">Upload Document</h2>

                <p className="mt-3 text-slate-400">
                  Drag & Drop your Document here
                </p>

                <button className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                  Select Document
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}

              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                {!currentChat.uploaded && (
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
                    <h2 className="text-xl font-semibold">Uploading...</h2>

                    <p className="mt-2 text-slate-400">{currentChat.name}</p>

                    <div className="mt-5 h-3 rounded-full bg-slate-700">
                      <div
                        className="h-3 rounded-full bg-cyan-400"
                        style={{
                          width: `${currentChat.progress}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-cyan-400">
                      {currentChat.progress}%
                    </p>
                  </div>
                )}

                {currentChat.uploaded &&
                  currentChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-3xl rounded-2xl px-5 py-4 ${
                          msg.sender === "user"
                            ? "bg-cyan-500 text-slate-950"
                            : "bg-slate-900 border border-slate-700"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Bottom Input */}

              <div className="border-t border-slate-700 bg-slate-950 p-5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800"
                  >
                    <span className="material-symbols-outlined">upload</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => addFiles(Array.from(e.target.files || []))}
                  />

                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    disabled={!currentChat.uploaded}
                    placeholder={
                      currentChat.uploaded
                        ? "Ask anything about this PDF..."
                        : "Upload must finish before chatting..."
                    }
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 outline-none focus:border-cyan-400 disabled:opacity-50"
                  />

                  <button
                    disabled={!currentChat.uploaded}
                    onClick={sendMessage}
                    className="rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
