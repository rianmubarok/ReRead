"use client";

import React from "react";
import BottomContainer from "@/components/ui/BottomContainer";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RiPencilLine } from "@remixicon/react";

interface ActionButtonsProps {
    bookId: string;
    ownerUid: string;
}

export default function ActionButtons({ bookId, ownerUid }: ActionButtonsProps) {
    const router = useRouter();
    const { user } = useAuth();

    const isOwner = user?.uid === ownerUid;

    const handleSendMessage = () => {
        router.push(`/chat/${ownerUid}?bookId=${bookId}`);
    };

    const handleEditBook = () => {
        router.push(`/my-books/edit/${bookId}`);
    };

    if (isOwner) {
        return (
            <BottomContainer className="gap-4">
                <Button
                    variant="primary"
                    fullWidth
                    className="flex-1 flex justify-center items-center gap-2" // Explicit flex centering
                    onClick={handleEditBook}
                >
                    <RiPencilLine className="w-5 h-5" />
                    <span>Edit Buku</span>
                </Button>
            </BottomContainer>
        );
    }

    return (
        <BottomContainer className="gap-4">
            <Button
                variant="outline"
                fullWidth
                className="flex-1"
                onClick={() => router.push(`/profile/${ownerUid}`)}
            >
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
