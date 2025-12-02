/** @format */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Phone, VideoIcon } from "lucide-react";

const DoctorMessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageText, setMessageText] = useState("");

  const consultations = [
    {
      id: 1,
      patientName: "John Doe",
      status: "ongoing",
      lastMessage: "Can you prescribe antibiotics?",
      timestamp: "Just now",
      unread: 2,
      consultationType: "virtual",
      messages: [
        {
          sender: "patient",
          text: "Good morning Dr. Smith, I have persistent cough",
          time: "10:15 AM",
        },
        {
          sender: "doctor",
          text: "Let me ask you some questions. How long have you had the cough?",
          time: "10:17 AM",
        },
        {
          sender: "patient",
          text: "About 5 days now",
          time: "10:18 AM",
        },
        {
          sender: "doctor",
          text: "Any fever or difficulty breathing?",
          time: "10:19 AM",
        },
        {
          sender: "patient",
          text: "Can you prescribe antibiotics?",
          time: "10:20 AM",
        },
      ],
    },
    {
      id: 2,
      patientName: "Jane Smith",
      status: "completed",
      lastMessage: "Thank you for your help",
      timestamp: "Yesterday",
      unread: 0,
      consultationType: "bedside",
      messages: [
        {
          sender: "doctor",
          text: "I've completed the examination. Everything looks good.",
          time: "3:45 PM",
        },
        {
          sender: "patient",
          text: "Thank you for your help",
          time: "3:50 PM",
        },
      ],
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      status: "pending",
      lastMessage: "Waiting for doctor response",
      timestamp: "2 hours ago",
      unread: 1,
      consultationType: "virtual",
      messages: [
        {
          sender: "patient",
          text: "I'd like to book a consultation",
          time: "8:30 AM",
        },
      ],
    },
  ];

  const statusColors: Record<string, string> = {
    ongoing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  const currentChat = consultations[selectedChat];

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
          <h1 className="text-3xl font-bold">Patient Messages</h1>
          <p className="text-gray-600">
            Chat with your patients and consultations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation List */}
        <div className="lg:col-span-1">
          <div className="app-card p-0">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {consultations.map((consultation, idx) => (
                    <button
                      key={consultation.id}
                      onClick={() => setSelectedChat(idx)}
                      className={`w-full text-left p-3 rounded-lg transition-colors border ${
                        selectedChat === idx
                          ? "bg-sky-100 border-sky-300"
                          : "hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-900">
                          {consultation.patientName}
                        </p>
                        {consultation.unread > 0 && (
                          <Badge className="bg-red-500">
                            {consultation.unread}
                          </Badge>
                        )}
                      </div>
                      <Badge
                        className={`text-xs mb-2 ${
                          statusColors[consultation.status]
                        }`}
                      >
                        {consultation.status}
                      </Badge>
                      <p className="text-sm text-gray-600 truncate">
                        {consultation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {consultation.timestamp}
                      </p>
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{currentChat.patientName}</CardTitle>
                    <Badge className={statusColors[currentChat.status]}>
                      {currentChat.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <VideoIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChat.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "doctor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        msg.sender === "doctor"
                          ? "bg-sky-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "doctor"
                            ? "text-sky-100"
                            : "text-gray-600"
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

export default DoctorMessagesPage;
