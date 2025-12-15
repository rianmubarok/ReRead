"use client";

import React from "react";
import { User } from "@/types/user";

interface HomeWelcomeProps {
    user: User | null;
}

export default function HomeWelcome({ user }: HomeWelcomeProps) {
    // Use first name for greeting
    const firstName = user?.name.split(" ")[0] || "Teman";

    return (
        <div className="flex flex-col gap-6 mb-6">
            <div className="space-y-1">
                <p className="text-sm text-brand-gray font-medium">
                    Selamat datang kembali, {firstName}!
                </p>
                <h1 className="text-2xl font-bold text-brand-black leading-tight">
                    Buku apa yang ingin <br /> kamu cari hari ini?
                </h1>
            </div>
        </div>
    );
}
