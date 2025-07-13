/** @format */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Using Label directly for simple cases
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { toast } from "@/hooks/use-toast";
import { CreditCard, HandCoins, Landmark, Users } from "lucide-react"; // HandCoins was used, using CreditCard

const donationSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number.",
    }),
  customAmount: z.string().optional(),
  donorName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  donorEmail: z.string().email({ message: "Invalid email address." }),
  paymentMethod: z.enum(
    ["creditCard", "bankTransfer", "crypto", "mobileMoney"],
    {
      required_error: "You need to select a payment method.",
    }
  ),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const predefinedAmounts = ["25", "50", "100", "250", "500"];

const DonationForm = ({ projectTitle }: { projectTitle: string }) => {
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: "50", // Default selected amount
      customAmount: "",
      donorName: "",
      donorEmail: "",
      paymentMethod: "creditCard",
    },
  });

  const selectedAmount = form.watch("amount");

  const onSubmit = (data: DonationFormValues) => {
    const finalAmount =
      data.amount === "custom" ? data.customAmount : data.amount;
    console.log("Donation submitted:", {
      ...data,
      amount: finalAmount,
      project: projectTitle,
    });
    // Here you would integrate with a payment gateway like Stripe
    toast({
      title: "Donation Processing",
      description: `Thank you for your donation of $${finalAmount} to ${projectTitle}! (This is a demo, no actual payment processed)`,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-semibold">
                Select Donation Amount (USD)
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== "custom") {
                      form.setValue("customAmount", ""); // Clear custom amount if predefined is selected
                    }
                  }}
                  defaultValue={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {predefinedAmounts.map((amount) => (
                    <FormItem
                      key={amount}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={amount} />
                      </FormControl>
                      <FormLabel className="font-normal text-base">
                        ${amount}
                      </FormLabel>
                    </FormItem>
                  ))}
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="custom" />
                    </FormControl>
                    <FormLabel className="font-normal text-base">
                      Custom
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedAmount === "custom" && (
          <FormField
            control={form.control}
            name="customAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Amount (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="donorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="donorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We&apos;ll send your donation receipt to this email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">
                Payment Method
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="creditCard">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" /> Credit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="bankTransfer">
                    <div className="flex items-center">
                      <Landmark className="mr-2 h-4 w-4" /> Bank Transfer
                      (Instructions will be provided)
                    </div>
                  </SelectItem>
                  <SelectItem value="crypto" disabled>
                    {" "}
                    {/* Example of a disabled option */}
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" /> Cryptocurrency (Coming
                      Soon)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Secure payment processing. Your information is safe.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Placeholder for actual payment fields (e.g., Stripe Elements) */}
        {form.getValues("paymentMethod") === "creditCard" && (
          <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-center text-gray-600">
              Secure credit card input (e.g., Stripe Elements) would appear
              here.
            </p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
        >
          <HandCoins className="mr-2 h-5 w-5" /> Proceed with Donation
        </Button>
      </form>
    </Form>
  );
};

export default DonationForm;
function toast({ title, description }: { title: string; description: string }) {
  // Simple fallback toast implementation using alert (replace with your UI toast system)
  alert(`${title}\n\n${description}`);
}
