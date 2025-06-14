import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '..'; // make sure the path is correct

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/ai/chat-board`, {
        message: input,
        isFirstMessage: isFirstMessage,
      });

      const botMsg = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMsg]);
      setIsFirstMessage(false);
    } catch (err) {
      console.error("Chat error", err);
    }
  };

  return (
    <div className="flex flex-col h-[50vh] max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      
      {/* Scrollable messages container */}
      <div className="flex-grow overflow-auto space-y-4 p-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs break-words ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed input area */}
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow p-2 rounded-lg border border-gray-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

