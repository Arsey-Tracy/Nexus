/** @format */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const UsersPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Users className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">View and manage all system users</p>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Users</span>
              <Button>Add User</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              User list functionality coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default UsersPage;
