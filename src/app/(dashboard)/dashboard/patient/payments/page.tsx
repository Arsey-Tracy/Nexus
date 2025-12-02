/** @format */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const PaymentsPage = () => {
  const transactions = [
    {
      id: 1,
      description: "Consultation with Dr. Smith",
      amount: "$50.00",
      date: "Nov 15, 2024",
      status: "completed",
    },
    {
      id: 2,
      description: "Bedside Checkup",
      amount: "$75.00",
      date: "Nov 10, 2024",
      status: "completed",
    },
    {
      id: 3,
      description: "Virtual Consultation",
      amount: "$40.00",
      date: "Oct 28, 2024",
      status: "completed",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="h-8 w-8 text-sky-600" />
        <div>
          <h1 className="text-3xl font-bold">Payments &amp; Billing</h1>
          <p className="text-gray-600">
            View your transactions and payment history
          </p>
        </div>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border rounded-lg p-4 bg-blue-50">
                <p className="font-semibold text-gray-800">Visa •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/26</p>
              </div>
              <Button variant="outline" className="w-full">
                Add New Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="app-card p-0">
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between pb-4 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {txn.description}
                    </p>
                    <p className="text-sm text-gray-600">{txn.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{txn.amount}</p>
                    <p className="text-sm text-green-600 capitalize">
                      {txn.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default PaymentsPage;
