/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/Spinner";
import {
  AdminContactMessage,
  deleteAdminContactMessage,
  getAdminContactMessages,
} from "@/lib/api/admin";
import { APIError, extractErrors } from "@/lib/api/api";

const PAGE_SIZE = 10;

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [page, setPage] = useState(1);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = filter === "all" ? undefined : filter;
      const response = await getAdminContactMessages(status, search);
      setMessages(response);
    } catch (err) {
      if (err instanceof APIError) {
        setError(extractErrors(err));
      } else {
        setError(err instanceof Error ? err.message : "Unable to load messages");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId: number) => {
    const confirmed = window.confirm("Delete this contact message? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteAdminContactMessage(messageId);
      setActionMessage("Message deleted.");
      fetchMessages();
    } catch (err) {
      if (err instanceof APIError) {
        setActionMessage(extractErrors(err));
      } else {
        setActionMessage(err instanceof Error ? err.message : "Unable to delete message");
      }
    }
  };

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter((message) =>
      [message.name, message.email, message.subject, message.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [messages, search]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const paginatedMessages = filteredMessages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-2">
          Review submissions from the contact form and delete spam or resolved requests.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {actionMessage && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-800">
          {actionMessage}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
        <Input
          placeholder="Search messages by name, email, or subject"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-xl"
        />
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            onClick={() => setFilter("read")}
          >
            Read
          </Button>
        </div>
        <Button onClick={() => fetchMessages()} variant="outline">
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Messages</CardTitle>
          <div className="text-sm text-slate-600">
            Showing {paginatedMessages.length} of {filteredMessages.length} matching messages
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : paginatedMessages.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No contact messages found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Message</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Subscribed</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Received</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-gray-800">{message.name}</td>
                    <td className="px-4 py-4 text-gray-600">{message.email}</td>
                    <td className="px-4 py-4 text-gray-800">{message.subject}</td>
                    <td className="px-4 py-4 text-gray-600 max-w-xs truncate">{message.message}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {message.newsletter_subscription ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={message.is_read ? "secondary" : "outline"}>
                        {message.is_read ? "Read" : "Unread"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(message.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
