"use client";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { Button } from "./ui/button";
import LoadingIndicator from "./LoadingIndicator";
import { Session } from "next-auth";
import { VscSignOut } from "react-icons/vsc";
import Image from "next/image";

export default function Header({ session }: { session: Session }) {
    const { data: status } = useSession()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)


    if (!session) return null

    const email = session.user?.email || ""
    const image = session.user?.image
    const initial = email.charAt(0).toUpperCase()

    return (
        <div className="absolute top-4 right-4 z-50">
            <div className="focus:outline-none">
                <Button
                    onClick={() => {
                        setLoading(true)
                        setTimeout(() => {
                            setOpen(prev => !prev)
                            setLoading(false)
                        }, 300)
                    }}
                    className="cursor-pointer"
                >
                    <CgProfile size={28} className="text-blue-500" />
                </Button>

                {open && (
                    <div className="absolute right-2 mt-2 w-40 bg-[#262626] rounded-md shadow-md p-2">
                        <div className="flex items-center flex-col gap-2">
                            {image ? (
                                <Image
                                    src={session.user?.image || '/default-avatar.png'}
                                    alt=""
                                    className="w-7 h-7 rounded-full border"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#4EA8DE] ">
                                    {initial}
                                </div>
                            )}
                            <div className="text-xs text-[#8284FA] break-words">{email}</div>
                            <hr />
                            <Button
                                onClick={async () => {
                                    setLoading(true)
                                    await signOut({ redirect: false })
                                    window.location.reload()
                                }}
                                className="text-sm hover cursor-pointer text-white bg-red-700"
                            >
                                Sign Out <VscSignOut />
                            </Button>
                        </div>
                    </div>

                )}
            </div>
            <LoadingIndicator isLoading={loading} />
        </div>
    )
}