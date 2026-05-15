/** @format */
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Send } from "lucide-react";
import { sendContactForm } from "@/lib/api/contact";
import { ContactFormData, contactSchema } from "@/lib/schemas/contact.schema";

const ContactFormSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const validated = contactSchema.safeParse(data);
      if (!validated.success) {
        console.log(validated.error.flatten());
        return;
      }
      await sendContactForm(data);
      setSuccess("Message sent successfully!");

      form.reset(); // clean form
      console.log(success);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Try again later.");

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-white to-slate-50 text-slate-900">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">
              Get in Touch
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Send Us a Message
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Share your question, request, or feedback and our team will
              respond promptly.
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 font-medium">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-4 text-sm text-rose-800 font-medium">
              ✕ {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="honeypot"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Bot detector"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          {...field}
                          className="bg-slate-50 text-slate-900 border-slate-300 placeholder:text-slate-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className="bg-slate-50 text-slate-900 border-slate-300 placeholder:text-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How can we help?"
                        {...field}
                        className="bg-slate-50 text-slate-900 border-slate-300 placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your message..."
                        {...field}
                        rows={6}
                        className="bg-slate-50 text-slate-900 border-slate-300 placeholder:text-slate-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-4 text-white font-semibold shadow-lg shadow-sky-500/30 transition-all hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-5 w-5" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
