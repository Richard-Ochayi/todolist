import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Login } from '@/actions/taskactions'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { FcGoogle } from "react-icons/fc"
import Link from 'next/link'


const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();



    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        await signIn("google", {
            callbackUrl: ("/"),
        })
    }
    const schema = z.object({
        email: z.string().min(2, { message: "email too short" }).max(50, { message: "email too long" }).email({ message: "Invalid email address" }),
        password: z.string().min(8, { message: "password too short" })
    })

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onsubmit = async (values: z.infer<typeof schema>) => {
        setLoading(true);
        const { email, password } = values

        const res = await fetch("/api/check-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password}),
        });

        const data = await res.json();

        if (res.ok && data.exists) {
            const result = await Login(email, password);
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(result.message);
                router.push("/");
            }
        } else if (res.status === 404) {
           const otpRes = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }), 
            });

            const otpData = await otpRes.json();

            if (otpRes.ok) {
                toast.success("OTP sent to your email.");
                router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(otpData.error || "Failed to send OTP");
            } 
        } else if (res.status === 401) {
                toast.error(data.error || "Wrong password");
            } else { 
                toast.error("Something went wrong");
            }
        setLoading(false);



    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className='bg-white p-10 rounded-md'>
                <h1 className='font-bold flex justify-center mb-5 text-2xl'>Sign Up / Sign In</h1>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input className='w-60 mb-3' placeholder='Enter email address' type='email' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name='password' render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input className='w-60' placeholder='Enter your password' type='password' {...field} />
                        </FormControl>
                    </FormItem>
                )} />
                <div className='text-right mt-2 text-sm'>
                    <Link href="/forgot-password" className='text-blue-500 hover:underline'>
                        forgot password?
                    </Link>
                </div>


                <Button type='submit' disabled={loading} className='mt-5 w-60 bg-[#334155] text-white hover:bg-[#1e293b]'>
                    {loading ? "Logging in..." : "Login"}
                </Button>
                <p className='flex items-center justify-center p-3 font-semibold'>OR</p>
                <Button type='button' disabled={googleLoading} className='w-60 bg-[#334155] text-white hover:bg-[#1e293b]' onClick={handleGoogleSignIn}>
                    {googleLoading ? "Signing in..." : (
                        <div className='flex items-center gap-1'>
                            <FcGoogle />
                            Sign in with Google
                        </div>
                    )}
                </Button>

            </form>
        </Form>
    )
}

export default LoginForm