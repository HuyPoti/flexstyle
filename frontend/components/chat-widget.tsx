"use client";

import { useState, useEffect, useRef } from "react";
import { Bot } from "lucide-react";

interface ChatWidgetConfig {
  chatUrl: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  style?: {
    primaryColor?: string;
    backgroundColor?: string;
    fontColor?: string;
  };
}

interface ChatWidgetProps {
  config: ChatWidgetConfig;
}

export default function ChatWidget({ config }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([{ sender: "bot", text: "Bạn cần hỗ trợ gì không?" }]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const primaryColor = config.style?.primaryColor || "#854fff";
  const backgroundColor = config.style?.backgroundColor || "#ffffff";
  const fontColor = config.style?.fontColor || "#333333";

  // Auto-scroll to bottom
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Get or create chatId safely
  const getChatId = async (): Promise<string> => {
    if (typeof window === "undefined") return "";
    let chatId = sessionStorage.getItem("chatId");
    if (!chatId) {
      try {
        const res = await fetch("/api/get-chat-id");
        if (!res.ok) throw new Error("Failed to get chat ID");
        const text = await res.text();
        let data: { chatId?: string } = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          // console.log("Unauthenticated user");
        }
        chatId =
          data.chatId || "chat_" + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem("chatId", chatId);
      } catch (err) {
        console.error("Error fetching chat ID:", err);
        chatId = "chat_" + Math.random().toString(36).substring(2, 10);
        sessionStorage.setItem("chatId", chatId);
      }
    }
    return chatId;
  };

  // Send message and handle bot response
  const handleSend = async () => {
    if (!input.trim()) return;

    const message = input.trim();
    const chatId = await getChatId();

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setInput("");

    try {
      const res = await fetch(config.chatUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, message }),
      });

      if (!res.ok) throw new Error("Failed to get bot response");
      console.log();
      // Safe JSON parsing
      const text = await res.text();
      let data: { output?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("Invalid JSON from chatUrl:", text);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.output || "Xin lỗi, mình không hiểu câu hỏi của bạn.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Network error. Please try again later." },
      ]);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{ backgroundColor: primaryColor }}
          className="fixed bottom-5 right-[100px] w-[60px] h-[60px] rounded-full text-white text-xl flex items-center justify-center shadow-lg hover:opacity-90 transition"
        >
          <Bot size={28} />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-10 right-[100px] flex flex-col rounded-xl shadow-xl overflow-hidden"
          style={{
            width: "350px",
            height: "500px",
            background: backgroundColor,
            color: fontColor,
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-4 font-bold text-lg"
            style={{ backgroundColor: primaryColor, color: "#fff" }}
          >
            <span>FlexStyle Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-white">
              X
            </button>
          </div>

          {/* Body */}
          <div
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((msg, i) => (
              <p
                key={i}
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "ml-auto bg-gray-100 text-gray-800"
                    : "bg-[#854fff] text-white"
                }`}
              >
                {msg.text}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-2 p-3 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm"
            />
            <button
              onClick={handleSend}
              style={{ backgroundColor: primaryColor }}
              className="text-white px-4 py-2 rounded-lg text-sm"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
