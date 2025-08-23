import { useState, useRef, useEffect } from "react";
import { FiPlus, FiSend, FiX, FiMaximize2, FiMinimize2, FiRotateCcw } from "react-icons/fi";
import axios from "axios";

export default function AIchat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI Trading Assistant. I can help you learn about trading, market analysis, investment strategies, and answer any questions you have about the financial markets. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore background scrolling
    };
  }, [isOpen, onClose]);

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
        text: res.data.answer || "Sorry, I couldn't generate a response. Please try again.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please check your internet connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "assistant", text: "Chat cleared! How can I assist you with trading and investments today?" }
    ]);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Chat Interface */}
      <div
        className={`absolute bg-gradient-to-b from-amber-50 to-yellow-50 rounded-2xl shadow-2xl border-4 border-amber-300 transition-all duration-300 ${
          isMaximized 
            ? "top-4 left-4 right-4 bottom-4" 
            : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[85vh]"
        }`}
        style={{ fontFamily: "Segoe UI, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b-4 border-amber-200 flex justify-between items-center bg-gradient-to-r from-amber-100 to-yellow-100 rounded-t-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.63 3.34 1.68 4.58-.05.14-.08.28-.08.42 0 .83.67 1.5 1.5 1.5.28 0 .54-.08.76-.21C9.56 16.19 10.72 17 12 17s2.44-.81 3.14-1.71c.22.13.48.21.76.21.83 0 1.5-.67 1.5-1.5 0-.14-.03-.28-.08-.42C18.37 12.34 19 10.74 19 9c0-3.87-3.13-7-7-7z"/>
                  <circle cx="9.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
                  <circle cx="14.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
                  <circle cx="12" cy="6" r="0.6" fill="rgba(0,0,0,0.6)"/>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-900">TradeWise AI Assistant</h1>
              <p className="text-sm text-amber-700">Your intelligent trading companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="p-3 rounded-xl hover:bg-amber-200 transition-all duration-200 text-amber-800 hover:text-amber-900 transform hover:scale-110"
              title="Clear Chat"
            >
              <FiRotateCcw size={18} />
            </button>
            <button
              onClick={toggleMaximize}
              className="p-3 rounded-xl hover:bg-amber-200 transition-all duration-200 text-amber-800 hover:text-amber-900 transform hover:scale-110"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all duration-200 text-amber-800 transform hover:scale-110"
              title="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-gradient-to-b from-amber-50 to-yellow-50" style={{ height: 'calc(100% - 180px)' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start space-x-2 w-full ${msg.role === "user" ? "flex-row-reverse space-x-reverse max-w-[85%] ml-auto" : "max-w-[85%]"}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                    : "bg-gradient-to-r from-amber-500 to-yellow-600"
                }`}>
                  {msg.role === "user" ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.63 3.34 1.68 4.58-.05.14-.08.28-.08.42 0 .83.67 1.5 1.5 1.5.28 0 .54-.08.76-.21C9.56 16.19 10.72 17 12 17s2.44-.81 3.14-1.71c.22.13.48.21.76.21.83 0 1.5-.67 1.5-1.5 0-.14-.03-.28-.08-.42C18.37 12.34 19 10.74 19 9c0-3.87-3.13-7-7-7z"/>
                      <circle cx="9.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
                      <circle cx="14.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
                    </svg>
                  )}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`flex-1 px-3 py-2 rounded-xl text-sm leading-relaxed shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                      : "bg-gradient-to-r from-white to-amber-50 text-amber-900 border-2 border-amber-200"
                  }`}
                  style={{ 
                    wordWrap: 'break-word', 
                    overflowWrap: 'break-word',
                    minWidth: 0,
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="break-words">{msg.text}</div>
                  <div className={`text-xs mt-1 opacity-70 ${msg.role === "user" ? "text-blue-100" : "text-amber-600"}`}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start w-full">
              <div className="flex items-start space-x-2 max-w-[85%]">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                </div>
                <div className="flex-1 bg-gradient-to-r from-amber-200 to-yellow-200 text-amber-800 px-3 py-2 rounded-xl text-sm border-2 border-amber-300 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="font-medium text-xs">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t-4 border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-b-xl">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about trading, investments, market analysis, or any financial questions..."
                  className="w-full border-3 border-amber-300 bg-white text-amber-900 rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-4 focus:ring-amber-500 focus:border-transparent shadow-lg placeholder-amber-600 pr-12"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  disabled={loading}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6" />
                  </svg>
                </div>
              </div>
              <div className="text-xs text-amber-600 mt-2 px-2">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black p-4 rounded-2xl transition-all duration-200 disabled:opacity-50 shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center min-w-[60px]"
              disabled={loading || !input.trim()}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}