"use client";

import React from "react";
import BottomContainer from "@/components/ui/BottomContainer";
import Button from "@/components/ui/Button";

export default function ActionButtons() {
    return (
        <BottomContainer className="gap-4">
            <Button variant="primary" fullWidth className="flex-1">
                Lihat Profil
            </Button>
            <Button variant="secondary" fullWidth className="flex-1">
                Kirim Pesan
            </Button>
        </BottomContainer>
    );
}
