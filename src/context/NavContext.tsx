"use client";

import React, { createContext, useContext, useState } from "react";

interface NavContextType {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: React.ReactNode }) {
    // Default to false to prevent flash of bottom nav before auth check
    const [isVisible, setVisible] = useState(false);

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
