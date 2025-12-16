"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_PATHS = ["/", "/auth/test-firebase"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isPublic = PUBLIC_PATHS.includes(pathname);

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !isPublic) {
            // Redirect to home (login flow) if not authenticated and not already on home
            router.replace("/");
        }
    }, [isLoading, isAuthenticated, pathname, router, isPublic]);

    // Show nothing or a loading spinner while checking auth on protected routes
    // But we want to allow "/" to render immediately (it handles its own auth check/onboarding)
    if (isLoading) {
        // You might want a global loading spinner here
        return null;
    }

    // Optionally hinder rendering of protected content until redirect happens
    // But since we use router.replace inside useEffect, a split second render might happen.
    // If we want to be strict:
    if (!isAuthenticated && !isPublic) {
        return null;
    }

    return <>{children}</>;
}
