"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface NavContextType {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
    // Default to false to prevent flash of bottom nav before auth check
    const [isVisible, setVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Automatically show nav for main tab routes
        // Home (/) handles its own visibility based on onboarding state
        const mainRoutes = ['/chat', '/bookmarks', '/profile'];
        if (mainRoutes.some(route => pathname.startsWith(route))) {
            setVisible(true);
        }
    }, [pathname]);

    return (
        <NavContext.Provider value={{ isVisible, setVisible }}>
            {children}
        </NavContext.Provider>
    );
}

export function useNav() {
    const context = useContext(NavContext);
    if (context === undefined) {
        throw new Error("useNav must be used within a NavProvider");
    }
    return context;
}
