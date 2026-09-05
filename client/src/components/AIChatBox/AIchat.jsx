import { useState, useRef, useEffect } from "react";
import { FiPlus, FiSend, FiX, FiMaximize2, FiMinimize2, FiRotateCcw } from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat/advice`, {
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

  // Handle close with better event handling
  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Invisible backdrop for click outside to close - Only for desktop */}
      {isOpen && (
        <div 
          className="fixed inset-0 transition-opacity duration-300 z-40 hidden md:block"
          onClick={onClose}
        />
      )}
      
      {/* Side Panel Chat Interface */}
      <div
        className={`fixed right-0 bg-gradient-to-b from-amber-50 to-yellow-50 shadow-2xl border-l-4 border-amber-300 transition-all duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${
          isMaximized 
            ? "w-full lg:w-3/4 xl:w-2/3" 
            : "w-full sm:w-96 lg:w-80 xl:w-96"
        }`}
        style={{ 
          fontFamily: "Segoe UI, sans-serif",
          top: "4rem", // Account for navbar height (approximately 64px)
          height: "calc(100vh - 4rem)" // Full height minus navbar
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-2 border-b-4 border-amber-200 h-fit flex justify-between items-center bg-gradient-to-r from-amber-100 to-yellow-100 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.63 3.34 1.68 4.58-.05.14-.08.28-.08.42 0 .83.67 1.5 1.5 1.5.28 0 .54-.08.76-.21C9.56 16.19 10.72 17 12 17s2.44-.81 3.14-1.71c.22.13.48.21.76.21.83 0 1.5-.67 1.5-1.5 0-.14-.03-.28-.08-.42C18.37 12.34 19 10.74 19 9c0-3.87-3.13-7-7-7z"/>
                  <circle cx="9.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
                  <circle cx="14.5" cy="8.5" r="0.8" fill="rgba(0,0,0,0.8)"/>
                  <circle cx="12" cy="6" r="0.6" fill="rgba(0,0,0,0.6)"/>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-amber-900">TradeWise AI</h1>
              <p className="text-xs text-amber-700">Trading Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-amber-200 transition-all duration-200 text-amber-800 hover:text-amber-900 transform hover:scale-110"
              title="Clear Chat"
            >
              <FiRotateCcw size={16} />
            </button>
            
            {/* Maximize/Minimize Button - Hidden on mobile */}
            <button
              onClick={toggleMaximize}
              className="p-2 rounded-lg hover:bg-amber-200 transition-all duration-200 text-amber-800 hover:text-amber-900 transform hover:scale-110 hidden sm:block"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
            </button>
            
            {/* Enhanced Close Button - More prominent */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-200 transform hover:scale-110 border-2 border-red-300 hover:border-red-400 shadow-md"
              title="Close Chat"
            >
              <FiX size={20} className="font-bold" />
            </button>
          </div>
        </div>

        {/* Additional Close Button for Mobile - Floating */}
        <div className="md:hidden">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-110 transition-all duration-200"
            title="Close Chat"
          >
            <FiX size={18} className="font-bold" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="mb-[-20px] flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-amber-50 to-yellow-50" style={{ height: 'calc(100vh - 204px)' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start space-x-2 w-full ${msg.role === "user" ? "flex-row-reverse space-x-reverse max-w-[90%] ml-auto" : "max-w-[90%]"}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                    : "bg-gradient-to-r from-amber-500 to-yellow-600"
                }`}>
                  {msg.role === "user" ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
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
              <div className="flex items-start space-x-2 max-w-[90%]">
                <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-black"></div>
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
        <div className="p-4 border-t-4 border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about trading, investments..."
                  className="w-full border-2 border-amber-300 bg-white text-amber-900 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-lg placeholder-amber-600 pr-8"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  disabled={loading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6" />
                  </svg>
                </div>
              </div>
              <div className="text-xs text-amber-600 mt-1 px-1">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black p-2 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center min-w-[40px]"
              disabled={loading || !input.trim()}
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}