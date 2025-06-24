"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'
import { toast } from 'sonner';

export default function ForgotPasswordPage(){
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email.")
    }
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (res.ok) {
    toast.success("Reset link has been sent to your email.")
  } else {
    setMessage(`{data.error || 'Something went wrong'}`);
  }

  setLoading(false);

  }

  
   return (
     <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
        <h3 className='mb-7'>Include the email address associated with your account and we’ll send you an email with instructions to reset your password.</h3>

        <label htmlFor="email" className="block text-gray-700 mb-2">
          Enter your email address
        </label>
        <Input
          type="email"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer"
        >
          {loading ? 'Sending...' : "Send Reset Instructions"}

        </Button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}