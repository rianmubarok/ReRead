import React from "react";

interface MobileContainerProps {
    children: React.ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
    return (
        <div className="min-h-screen w-full bg-[#E5E5E5] flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen overflow-hidden flex flex-col">
                {children}
            </div>
        </div>
    );
}
