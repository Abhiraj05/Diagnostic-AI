"use client";

import Link from "next/link";
import Loader from "@/components/Loader";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Page() {

  const [pdfChats, setPdfChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingFileId, setUploadingFileId] = useState(null);

  useEffect(() => {
    currentChatIdRef.current = currentChat?.id ?? null;
  }, [currentChat]);

  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const currentChatIdRef = useRef(null);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("access_token");

    if (!storedToken) {
      console.log("No access token found");
      setLoading(false);
      return;
    }

    setToken(storedToken);
  }, []);


  useEffect(() => {
    if (!token) return;

    let active = true;

    const wsUrl =
      `ws://127.0.0.1:8000/chats/document-chat?token=${encodeURIComponent(token)}`;

    console.log("Opening WebSocket:", wsUrl);

    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen = () => {
      if (!active) return;
      console.log("WebSocket OPEN");
    };

    socket.onmessage = (event) => {
      if (!active) return;

      console.log("WebSocket RAW:", event.data);

      let data;

      try {
        data = JSON.parse(event.data);
      } catch {

        data = {
          type: "message",
          ai_msg: event.data,
        };
      }

      console.log("WebSocket DATA:", data);

      if (data?.type === "thinking") {
        setIsGenerating(true);
        return;
      }

      if (data?.type === "error") {
        console.error(
          "WebSocket backend error:",
          data.message
        );

        setIsGenerating(false);

        setCurrentChat((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            messages: (prev.messages || []).filter(
              (msg) => !msg.isTyping
            ),
          };
        });

        return;
      }

      if (data?.type === "done") {
        setIsGenerating(false);
        return;
      }

      let aiText = "";

      if (data?.type === "message") {
        aiText = data.ai_msg;
      } else {
 
        aiText =
          data?.ai_msg ??
          data?.answer ??
          data?.response ??
          data?.content ??
          "";
      }

      if (
        aiText &&
        typeof aiText === "object"
      ) {
        aiText =
          aiText.content ??
          aiText.text ??
          JSON.stringify(aiText);
      }

      if (!aiText) {
        console.log(
          "No AI response in WebSocket message."
        );
        return;
      }

      aiText = String(aiText);

      console.log(
        "AI RESPONSE RECEIVED:",
        aiText
      );

      setIsGenerating(false);

      setCurrentChat((prev) => {
        if (!prev) return prev;

        const messages = [
          ...(prev.messages || []),
        ];

        let waitingIndex = -1;

        for (
          let i = messages.length - 1;
          i >= 0;
          i--
        ) {
          if (
            messages[i].sender === "assistant" &&
            messages[i].isTyping
          ) {
            waitingIndex = i;
            break;
          }
        }

        const aiMessage = {
          sender: "assistant",
          text: aiText,
          isTyping: false,
        };

        if (waitingIndex !== -1) {
          messages[waitingIndex] = aiMessage;
        } else {
          messages.push(aiMessage);
        }

        return {
          ...prev,
          messages,
        };
      });

      setPdfChats((prevChats) =>
        prevChats.map((chat) => {
          if (
            chat.id !==
            currentChatIdRef.current
          ) {
            return chat;
          }

          const messages = [
            ...(chat.messages || []),
          ];

          let waitingIndex = -1;

          for (
            let i = messages.length - 1;
            i >= 0;
            i--
          ) {
            if (
              messages[i].sender === "assistant" &&
              messages[i].isTyping
            ) {
              waitingIndex = i;
              break;
            }
          }

          const aiMessage = {
            sender: "assistant",
            text: aiText,
            isTyping: false,
          };

          if (waitingIndex !== -1) {
            messages[waitingIndex] = aiMessage;
          } else {
            messages.push(aiMessage);
          }

          return {
            ...chat,
            messages,
          };
        })
      );
    };

    socket.onerror = (event) => {
      if (!active) return;

      console.error(
        "WebSocket ERROR:",
        event
      );
    };

    socket.onclose = (event) => {
      if (!active) return;

      console.log(
        "WebSocket CLOSED:",
        event.code,
        event.reason
      );

      setIsGenerating(false);
    };

    return () => {
      active = false;

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close(1000, "Component cleanup");
      }
    };
  }, [token]);


  useEffect(() => {
    if (!token) {
      return;
    }

    const getChatsFiles =
      async () => {
        try {
          const response =
            await axios.get(
              "http://127.0.0.1:8000/chats/get-chats-files",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          console.log(
            "Chat files response:",
            response.data
          );

          const chatsFiles =
            Array.isArray(
              response.data
                .chats_files
            )
              ? response.data
                  .chats_files
              : [];

          const formattedChats =
            chatsFiles.map(
              (chat) => ({
                id: chat.id,

                name:
                  chat.file_name,

                file_id:
                  chat.id,

                upload_date:
                  chat.upload_date,

                progress: 100,

                uploaded: true,

                messages: [],
              })
            );

          setPdfChats(
            formattedChats
          );
        } catch (error) {
          console.error(
            "Get chat files error:",
            error.response
              ?.data ||
              error.message
          );

          if (
            error.response
              ?.status === 401
          ) {
            localStorage.removeItem(
              "access_token"
            );

            setToken(null);
          }
        } finally {
          setLoading(false);
        }
      };

    getChatsFiles();
  }, [token]);

  const selectChat =
    async (id) => {
      if (!token) {
        return;
      }

      try {
        console.log(
          "Loading chat:",
          id
        );

        const response =
          await axios.get(
            `http://127.0.0.1:8000/chats/get-chats/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "Chat history response:",
          response.data
        );

        const history =
          Array.isArray(
            response.data
              .chats_history
          )
            ? response.data
                .chats_history
            : [];

        const messages = [];

        history.forEach(
          (item) => {
            if (
              item.user_msg
            ) {
              messages.push({
                sender:
                  "user",

                text:
                  item.user_msg,

                isTyping: false,
              });
            }

            if (
              item.ai_msg
            ) {
              messages.push({
                sender:
                  "assistant",

                text:
                  item.ai_msg,

                isTyping: false,
              });
            }
          }
        );

        const existingChat =
          pdfChats.find(
            (chat) =>
              chat.id === id
          );

        const selectedChat = {
          id: id,

          name:
            existingChat?.name ||
            `Document ${id}`,

          file_id: id,

          upload_date:
            existingChat?.upload_date ||
            null,

          progress: 100,

          uploaded: true,

          messages:
            messages,
        };

        setCurrentChat(
          selectedChat
        );

        setPdfChats(
          (prevChats) =>
            prevChats.map(
              (chat) =>
                chat.id === id
                  ? {
                      ...chat,

                      messages:
                        messages,

                      uploaded:
                        true,

                      progress:
                        100,
                    }
                  : chat
            )
        );
      } catch (error) {
        console.error(
          "Get chat history error:",
          error.response
            ?.data ||
            error.message
        );

        if (
          error.response
            ?.status === 401
        ) {
          localStorage.removeItem(
            "access_token"
          );

          setToken(null);
        }
      }
    };

  const addFiles = async (selectedFiles) => {
    if (!token) {
      return;
    }

    const supportedFiles = selectedFiles.filter((file) => {
      const name = file.name.toLowerCase();

      return (
        file.type === "application/pdf" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        name.endsWith(".pdf") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png")
      );
    });

    if (supportedFiles.length === 0) {
      alert("Please select a PDF, JPG, JPEG or PNG file.");
      return;
    }

    for (const file of supportedFiles) {
      const tempId =
        Date.now() +
        Math.random();

      const tempChat = {
        id: tempId,
        name: file.name,
        file_id: null,
        size:
          (file.size / (1024 * 1024)).toFixed(1) +
          " MB",
        progress: 0,
        uploaded: false,
        processing: true,
        upload_date:
          new Date()
            .toISOString()
            .split("T")[0],
        messages: [],
      };

    
      setPdfChats((prev) => [
        ...prev,
        tempChat,
      ]);


      setCurrentChat((prev) =>
        prev ? prev : tempChat
      );

      const formData = new FormData();
      formData.append("file", file);

      setUploadingFileId(tempId);

      try {
        console.log(
          "Uploading document:",
          file.name
        );

        
        const response = await axios.post(
          "http://127.0.0.1:8000/chats/upload-file",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },

           
            timeout: 0,

            onUploadProgress: (event) => {
              if (!event.total) {
                return;
              }

              const networkProgress = Math.round(
                (event.loaded * 100) /
                  event.total
              );

             
              const progress = Math.min(
                networkProgress,
                95
              );

              setPdfChats((prev) =>
                prev.map((chat) =>
                  chat.id === tempId
                    ? {
                        ...chat,
                        progress,
                      }
                    : chat
                )
              );

              setCurrentChat((prev) =>
                prev?.id === tempId
                  ? {
                      ...prev,
                      progress,
                    }
                  : prev
              );
            },
          }
        );

        console.log(
          "Upload endpoint response:",
          response.data
        );

      
        const fileId =
          response.data?.file_id;

      
        if (!fileId) {
          const backendMessage =
            response.data?.message ||
            "File was not uploaded.";

          alert(backendMessage);

          setPdfChats((prev) =>
            prev.filter(
              (chat) =>
                chat.id !== tempId
            )
          );

          setCurrentChat((prev) =>
            prev?.id === tempId
              ? null
              : prev
          );

          continue;
        }

        const uploadedChat = {
          ...tempChat,

          
          id: fileId,
          file_id: fileId,

          progress: 100,
          uploaded: true,
          processing: false,

          messages: [],
        };

        setPdfChats((prev) =>
          prev.map((chat) =>
            chat.id === tempId
              ? uploadedChat
              : chat
          )
        );

        setCurrentChat((prev) =>
          prev?.id === tempId
            ? uploadedChat
            : prev
        );

        console.log(
          "Document processed successfully:",
          fileId
        );

      } catch (error) {
        console.error(
          "Upload/process error:",
          error.response?.data ||
            error.message
        );

        const status =
          error.response?.status;

        const backendMessage =
          error.response?.data?.detail ||
          error.response?.data?.message;

        if (status === 401) {
          localStorage.removeItem(
            "access_token"
          );

          setToken(null);

          return;
        }

        alert(
          backendMessage ||
          `Failed to process ${file.name}.`
        );

        setPdfChats((prev) =>
          prev.filter(
            (chat) =>
              chat.id !== tempId
          )
        );

        setCurrentChat((prev) =>
          prev?.id === tempId
            ? null
            : prev
        );
      } finally {
        setUploadingFileId(null);
      }
    }
  };

  const handleDrop =
    (event) => {
      event.preventDefault();

      setIsDragging(false);

      const files =
        Array.from(
          event.dataTransfer
            .files
        );

      if (
        files.length > 0
      ) {
        addFiles(files);
      }
    };

  const deleteChat =
    async (id) => {
      if (!token) {
        return;
      }

      try {
        await axios.delete(
          `http://127.0.0.1:8000/chats/delete-chat/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const updatedChats =
          pdfChats.filter(
            (chat) =>
              chat.id !== id
          );

        setPdfChats(
          updatedChats
        );

        if (
          currentChat?.id ===
          id
        ) {
          setCurrentChat(
            null
          );
        }
      } catch (error) {
        console.error(
          "Delete error:",
          error.response
            ?.data ||
            error.message
        );

        if (
          error.response
            ?.status === 401
        ) {
          localStorage.removeItem(
            "access_token"
          );

          setToken(null);
        }
      }
    };

  const sendMessage = () => {
    const userText = message.trim();

    if (
      !userText ||
      !currentChat ||
      !currentChat.uploaded ||
      isGenerating
    ) {
      return;
    }

    const socket = socketRef.current;

    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN
    ) {
      console.log(
        "WebSocket is not OPEN"
      );

      return;
    }

    const chatId = currentChat.id;

    const userMessage = {
      sender: "user",
      text: userText,
      isTyping: false,
    };

    const waitingMessage = {
      sender: "assistant",
      text: "",
      isTyping: true,
    };

    setCurrentChat((prev) => {
      if (!prev || prev.id !== chatId) {
        return prev;
      }

      return {
        ...prev,
        messages: [
          ...(prev.messages || []),
          userMessage,
          waitingMessage,
        ],
      };
    });

    setPdfChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...(chat.messages || []),
                userMessage,
                waitingMessage,
              ],
            }
          : chat
      )
    );

    setMessage("");
    setIsGenerating(true);

    socket.send(
      JSON.stringify({
        file_id: currentChat.file_id,
        message: userText,
      })
    );
  };


  if (loading) {
    return <Loader />;
  }


  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold">
            Authentication Required
          </h2>

          <p className="mt-3 text-slate-400">
            Please login again.
          </p>

          <Link
            href="/signin"
            className="inline-block mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950"
          >
            Go to Login
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">

      <aside
        className={`transition-all duration-300 border-r border-slate-700 bg-slate-900 ${
          sidebarOpen
            ? "w-72"
            : "w-0"
        } overflow-hidden flex flex-col`}
      >

        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700">

          <h2 className="font-semibold text-lg">
            Chats History
          </h2>

          <button
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            className="rounded-lg p-2 hover:bg-slate-800"
          >
            ✕
          </button>

        </div>


        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {pdfChats.length ===
            0 && (
            <div className="text-center text-slate-400 mt-10">
              No PDFs uploaded
            </div>
          )}

          {Array.isArray(
            pdfChats
          ) &&
            pdfChats.map(
              (chat) => (
                <div
                  key={chat.id}
                  onClick={() =>
                    selectChat(
                      chat.file_id ||
                        chat.id
                    )
                  }
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    currentChat?.id ===
                    chat.id
                      ? "border-cyan-400 bg-slate-800"
                      : "border-slate-700 bg-slate-900 hover:bg-slate-800"
                  }`}
                >

                  <div className="flex justify-between items-start">

                    <div className="flex gap-3 min-w-0">

                      <span className="material-symbols-outlined text-cyan-400">
                        description
                      </span>

                      <div className="min-w-0">

                        <p className="text-sm font-medium truncate w-40">
                          {
                            chat.name
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          {
                            chat.upload_date
                          }
                        </p>

                      </div>

                    </div>

                    {/* Delete */}

                    <button
                      onClick={(
                        event
                      ) => {
                        event.stopPropagation();

                        deleteChat(
                          chat.id
                        );
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
                      className="h-2 rounded-full bg-cyan-400 transition-all"
                      style={{
                        width: `${chat.progress}%`,
                      }}
                    />
                  </div>

                  {chat.processing && (
                    <p className="mt-2 text-xs text-cyan-400">
                      {chat.progress < 95
                        ? `Uploading ${chat.progress}%`
                        : "Processing document & generating embeddings..."}
                    </p>
                  )}

                </div>
              )
            )}

        </div>

      </aside>


      <div className="flex-1 flex flex-col">

    
        <header className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-950">

          <div className="flex items-center gap-3">

            {!sidebarOpen && (
              <button
                onClick={() =>
                  setSidebarOpen(
                    true
                  )
                }
                className="rounded-lg p-2 hover:bg-slate-800"
              >
                <span className="material-symbols-outlined">
                  menu
                </span>
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

        <div className="flex-1 flex flex-col overflow-hidden">


          {!currentChat ? (

            <div className="flex-1 flex items-center justify-center p-8">

              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(
                  event
                ) => {
                  event.preventDefault();

                  setIsDragging(
                    true
                  );
                }}
                onDragLeave={() =>
                  setIsDragging(
                    false
                  )
                }
                onDrop={
                  handleDrop
                }
                className={`w-full max-w-3xl rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition ${
                  isDragging
                    ? "border-cyan-400 bg-slate-900"
                    : "border-slate-700 bg-slate-900"
                }`}
              >

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(
                    event
                  ) =>
                    addFiles(
                      Array.from(
                        event
                          .target
                          .files ||
                          []
                      )
                    )
                  }
                />

                <span className="material-symbols-outlined text-7xl text-cyan-400">
                  cloud_upload
                </span>

                <h2 className="mt-6 text-3xl font-bold">
                  Upload Document
                </h2>

                <p className="mt-3 text-slate-400">
                  Drag & Drop your Document here (PDF, JPG, PNG)
                </p>

                <button className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                  Select Document
                </button>

              </div>

            </div>

          ) : (

            <>
             
              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">

                {/* File name */}

                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>
                    {currentChat.name}
                  </span>

                  {currentChat.processing && (
                    <span className="text-cyan-400">
                      Processing document...
                    </span>
                  )}
                </div>


                {currentChat.messages
                  ?.length ===
                  0 && (
                  <div className="text-center text-slate-500 py-20">

                    <span className="material-symbols-outlined text-5xl">
                      chat
                    </span>

                    <p className="mt-3">
                      No chat history yet.
                    </p>

                    <p className="text-sm mt-1">
                      Ask a question about this document.
                    </p>

                  </div>
                )}

                {Array.isArray(
                  currentChat.messages
                ) &&
                  currentChat.messages.map(
                    (
                      msg,
                      index
                    ) => (

                      <div
                        key={
                          index
                        }
                        className={`flex ${
                          msg.sender ===
                          "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >


                        {msg.sender ===
                          "user" && (
                          <div className="max-w-3xl rounded-2xl px-5 py-4 bg-cyan-500 text-slate-950">

                            <p className="whitespace-pre-wrap">
                              {
                                msg.text
                              }
                            </p>

                          </div>
                        )}

                        {msg.sender ===
                          "assistant" && (

                          <div className="max-w-3xl rounded-2xl px-5 py-4 bg-slate-900 border border-slate-700">


                            {msg.isTyping ? (

                              <div className="flex items-center gap-2">

                                <span className="text-sm text-slate-400">
                                  Thinking
                                </span>

                                <div className="flex gap-1">

                                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />

                                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />

                                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />

                                </div>

                              </div>

                            ) : (


                              <p className="whitespace-pre-wrap">
                                {
                                  msg.text
                                }
                              </p>

                            )}

                          </div>

                        )}

                      </div>
                    )
                  )}

              </div>


              <div className="border-t border-slate-700 bg-slate-950 p-5">

                <div className="flex items-center gap-3">


                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="rounded-xl border border-slate-700 bg-slate-900 p-3 hover:bg-slate-800"
                  >

                    <span className="material-symbols-outlined">
                      upload
                    </span>

                  </button>

                  <input
                    ref={
                      fileInputRef
                    }
                    hidden
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(
                      event
                    ) =>
                      addFiles(
                        Array.from(
                          event
                            .target
                            .files ||
                            []
                        )
                      )
                    }
                  />
                  <input
                    value={message}
                    onChange={(
                      event
                    ) =>
                      setMessage(
                        event.target
                          .value
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                        "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        sendMessage();
                      }
                    }}
                    disabled={
                      !currentChat?.uploaded ||
                      isGenerating ||
                      uploadingFileId !== null
                    }
                    placeholder="Ask anything about this document..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 outline-none focus:border-cyan-400 disabled:opacity-50"
                  />

                  <button
                    disabled={
                      !currentChat?.uploaded ||
                      currentChat?.processing ||
                      !message.trim() ||
                      isGenerating ||
                      uploadingFileId !== null
                    }
                    onClick={
                      sendMessage
                    }
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