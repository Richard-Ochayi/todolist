import { Loader, Loader2 } from "lucide-react";
import React from "react";



export default function LoadingIndicator({ isLoading } : { isLoading: boolean }) {
    if (!isLoading) return null;

    return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                <Loader className="w-6 h-6 text-[#8284FA] animate-spin"/>
            </div>
    )

}