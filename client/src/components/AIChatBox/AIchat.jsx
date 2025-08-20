import { useState } from "react";
import { FiPlus, FiSend, FiX } from "react-icons/fi";
import axios from "axios";

export default function AIchat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I can help you learn about trading and investing. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/chat/advice", {
        question: userMessage.text,
      });

      const botMessage = {
        role: "assistant",
        text: res.data.answer || "Sorry, I couldn't generate a response.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error: Could not connect to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[500px] bg-[#343541] flex transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ fontFamily: "Segoe UI, sans-serif" }}
    >
      {/* Sidebar */}
      <section className="w-[70px] bg-[#202123] text-white flex flex-col items-center py-4 space-y-4">
        <button
          className="p-3 rounded-md bg-[#343541] hover:bg-[#40414f] transition"
          title="New Chat"
          onClick={() => setMessages([{ role: "assistant", text: "New conversation started!" }])}
        >
          <FiPlus size={20} />
        </button>
      </section>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#343541] text-white">
          <h1 className="text-base font-semibold">TradeWise AI</h1>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-[#40414f] transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Messages */}
        <ul className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#343541]">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0b93f6] text-white"
                    : "bg-[#40414f] text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </li>
          ))}
          {loading && (
            <li className="flex justify-start">
              <div className="bg-[#40414f] text-gray-400 px-4 py-2 rounded-lg text-sm">
                Thinking...
              </div>
            </li>
          )}
        </ul>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-[#343541] flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 border border-gray-600 bg-[#40414f] text-white rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-[#0b93f6] hover:bg-[#0a84d6] text-white p-2 rounded-md transition"
            disabled={loading}
          >
            <FiSend size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
