/** @format */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MessagesPage = () => {
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

      <div className="max-w-2xl">
        <div className="app-card p-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
                <p className="text-amber-900 font-medium mb-2">
                  Messaging Feature Under Development
                </p>
                <p className="text-amber-800">
                  We&apos;re building a real-time messaging platform to help you
                  communicate with your healthcare providers. This feature will
                  be available soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesPage;