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
        // We explicitly check for routes that should have the bottom nav
        const mainRoutes = [
            '/',
            '/chat',
            '/bookmarks',
            '/profile'
        ];

        // Check exact match for Home
        if (pathname === '/') {
            setVisible(true);
            return;
        }

        // Check for other routes
        // For /chat, only the list page should show nav, specific chat rooms (/chat/id) usually hide it
        if (pathname === '/chat') {
            setVisible(true);
            return;
        }

        // For bookmarks and profile, we generally show it, unless specifically hidden by subpages
        // Using startsWith allows /profile/settings etc to still have nav if desired, 
        // but we can refine if needed.
        if (pathname.startsWith('/bookmarks') || pathname.startsWith('/profile') || pathname === '/my-books') {
            setVisible(true);
            return;
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
