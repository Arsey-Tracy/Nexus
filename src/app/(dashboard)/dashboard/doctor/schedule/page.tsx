/** @format */
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState("2024-12-01");
  const [availabilitySlots, setAvailabilitySlots] = useState([
    { id: 1, date: "2024-12-01", time: "09:00", duration: 30, type: "virtual" },
    { id: 2, date: "2024-12-01", time: "10:00", duration: 30, type: "virtual" },
    { id: 3, date: "2024-12-01", time: "14:00", duration: 60, type: "bedside" },
  ]);

  const handleAddSlot = () => {
    const newSlot = {
      id: availabilitySlots.length + 1,
      date: selectedDate,
      time: "10:00",
      duration: 30,
      type: "virtual",
    };
    setAvailabilitySlots([...availabilitySlots, newSlot]);
  };

  const handleDeleteSlot = (id: number) => {
    setAvailabilitySlots(availabilitySlots.filter((slot) => slot.id !== id));
  };

  const slotsForDate = availabilitySlots.filter((s) => s.date === selectedDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Schedule &amp; Availability</h1>
          <p className="text-gray-600">Manage your consultation time slots</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar/Date Picker */}
        <div className="lg:col-span-1">
          <div className="app-card p-0">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["2024-12-01", "2024-12-02", "2024-12-03", "2024-12-04"].map(
                    (date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`w-full p-2 rounded text-left transition-colors ${
                          selectedDate === date
                            ? "bg-sky-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Time Slots */}
        <div className="lg:col-span-2">
          <div className="app-card p-0">
            <Card className="rounded-none">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Available Slots</CardTitle>
                  <Button size="sm" onClick={handleAddSlot}>
                    <Plus className="h-4 w-4 mr-1" /> Add Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {slotsForDate.length > 0 ? (
                  <div className="space-y-3">
                    {slotsForDate.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-sky-600" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {slot.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              {slot.duration} min •{" "}
                              <Badge variant="outline" className="ml-1">
                                {slot.type}
                              </Badge>
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No slots added for this date</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleAddSlot}
                    >
                      Add First Slot
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Availability Summary */}
      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Availability Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Slots This Week</p>
                <p className="text-2xl font-bold text-sky-600 mt-1">
                  {
                    availabilitySlots.filter(
                      (s) => new Date(s.date) <= new Date(selectedDate)
                    ).length
                  }
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Virtual Consultations</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {availabilitySlots.filter((s) => s.type === "virtual").length}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Bedside Visits</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {availabilitySlots.filter((s) => s.type === "bedside").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SchedulePage;
//   const [selectedChat, setSelectedChat] = useState(0);
//   const [messageText, setMessageText] = useState("");

//   const chats = [
//     {
//       id: 1,
//       doctor: "Dr. Smith",
//       lastMessage: "Your prescription is ready",
//       timestamp: "2 hours ago",
//       unread: 0,
//       messages: [
//         {
//           sender: "doctor",
//           text: "Your prescription is ready",
//           time: "2:30 PM",
//         },
//         {
//           sender: "patient",
//           text: "Thank you, when can I pick it up?",
//           time: "2:35 PM",
//         },
//       ],
//     },
//     {
//       id: 2,
//       doctor: "Dr. Johnson",
//       lastMessage: "See you next week",
//       timestamp: "1 day ago",
//       unread: 1,
//       messages: [
//         { sender: "doctor", text: "See you next week", time: "4:15 PM" },
//       ],
//     },
//   ];

//   const sendMessage = () => {
//     if (messageText.trim()) {
//       setMessageText("");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="max-w-7xl mx-auto p-8 space-y-6"
//     >
//       <div className="flex items-center space-x-3 mb-6">
//         <MessageSquare className="h-8 w-8 text-sky-600" />
//         <div>
//           <h1 className="text-3xl font-bold">Messages</h1>
//           <p className="text-gray-600">Chat with your healthcare providers</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Chat List */}
//         <div className="lg:col-span-1">
//           <div className="app-card p-0">
//             <Card className="rounded-none">
//               <CardHeader>
//                 <CardTitle>Conversations</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   {chats.map((chat, idx) => (
//                     <button
//                       key={chat.id}
//                       onClick={() => setSelectedChat(idx)}
//                       className={`w-full text-left p-3 rounded-lg transition-colors ${
//                         selectedChat === idx
//                           ? "bg-sky-100 border border-sky-300"
//                           : "hover:bg-gray-100 border border-gray-200"
//                       }`}
//                     >
//                       <p className="font-semibold text-gray-900">
//                         {chat.doctor}
//                       </p>
//                       <p className="text-sm text-gray-600 truncate">
//                         {chat.lastMessage}
//                       </p>
//                       <p className="text-xs text-gray-500">{chat.timestamp}</p>
//                     </button>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Chat Window */}
//         <div className="lg:col-span-2">
//           <div className="app-card p-0 h-[600px] flex flex-col">
//             <Card className="rounded-none h-full flex flex-col">
//               <CardHeader className="border-b">
//                 <CardTitle>{chats[selectedChat].doctor}</CardTitle>
//               </CardHeader>
//               <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {chats[selectedChat].messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`flex ${
//                       msg.sender === "doctor" ? "justify-start" : "justify-end"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-xs rounded-lg px-4 py-2 ${
//                         msg.sender === "doctor"
//                           ? "bg-gray-200 text-gray-900"
//                           : "bg-sky-600 text-white"
//                       }`}
//                     >
//                       <p>{msg.text}</p>
//                       <p
//                         className={`text-xs mt-1 ${
//                           msg.sender === "doctor"
//                             ? "text-gray-600"
//                             : "text-sky-100"
//                         }`}
//                       >
//                         {msg.time}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//               <div className="border-t p-4">
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="Type a message..."
//                     value={messageText}
//                     onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setMessageText(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                   />
//                   <Button
//                     onClick={sendMessage}
//                     size="icon"
//                     className="bg-sky-600 hover:bg-sky-700"
//                   >
//                     <Send className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // export default SchedulePage;
