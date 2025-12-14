"use client";

import React from "react";
import BottomContainer from "@/components/ui/BottomContainer";
import Button from "@/components/ui/Button";

import { useRouter } from "next/navigation";

interface ActionButtonsProps {
    bookId: string;
    ownerId: string;
}

export default function ActionButtons({ bookId, ownerId }: ActionButtonsProps) {
    const router = useRouter();

    const handleSendMessage = () => {
        router.push(`/chat/${ownerId}?bookId=${bookId}`);
    };

    return (
        <BottomContainer className="gap-4">
            <Button variant="primary" fullWidth className="flex-1">
                Lihat Profil
            </Button>
            <Button
                variant="secondary"
                fullWidth
                className="flex-1"
                onClick={handleSendMessage}
            >
                Kirim Pesan
            </Button>
        </BottomContainer>
    );
}
