/** @format */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageText, setMessageText] = useState("");

  const chats = [
    {
      id: 1,
      doctor: "Dr. Smith",
      lastMessage: "Your prescription is ready",
      timestamp: "2 hours ago",
      unread: 0,
      messages: [
        {
          sender: "doctor",
          text: "Your prescription is ready",
          time: "2:30 PM",
        },
        {
          sender: "patient",
          text: "Thank you, when can I pick it up?",
          time: "2:35 PM",
        },
      ],
    },
    {
      id: 2,
      doctor: "Dr. Johnson",
      lastMessage: "See you next week",
      timestamp: "1 day ago",
      unread: 1,
      messages: [
        { sender: "doctor", text: "See you next week", time: "4:15 PM" },
      ],
    },
  ];

  const sendMessage = () => {
    if (messageText.trim()) {
      setMessageText("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600">Chat with your healthcare providers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <div className="app-card p-0">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chats.map((chat, idx) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(idx)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedChat === idx
                          ? "bg-sky-100 border border-sky-300"
                          : "hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <p className="font-semibold text-gray-900">
                        {chat.doctor}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500">{chat.timestamp}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <div className="app-card p-0 h-[600px] flex flex-col">
            <Card className="rounded-none h-full flex flex-col">
              <CardHeader className="border-b">
                <CardTitle>{chats[selectedChat].doctor}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {chats[selectedChat].messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "doctor" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        msg.sender === "doctor"
                          ? "bg-gray-200 text-gray-900"
                          : "bg-sky-600 text-white"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "doctor"
                            ? "text-gray-600"
                            : "text-sky-100"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesPage;
