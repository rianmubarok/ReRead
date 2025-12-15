"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNav } from "@/context/NavContext";
import {
  RiHomeLine,
  RiHomeFill,
  RiChat3Line,
  RiChat3Fill,
  RiBookmarkLine,
  RiBookmarkFill,
  RiUserLine,
  RiUserFill,
} from "@remixicon/react";
import { MOCK_CHATS } from "@/data/mockChats";

export default function BottomNav() {
  const { isVisible } = useNav();
  const pathname = usePathname();

  if (!isVisible) return null;

  const navItems = [
    { href: "/", label: "Home", iconLine: RiHomeLine, iconFill: RiHomeFill },
    {
      href: "/chat",
      label: "Chat",
      iconLine: RiChat3Line,
      iconFill: RiChat3Fill,
    },
    {
      href: "/bookmarks",
      label: "Bookmarks",
      iconLine: RiBookmarkLine,
      iconFill: RiBookmarkFill,
    },
    {
      href: "/profile",
      label: "User",
      iconLine: RiUserLine,
      iconFill: RiUserFill,
    },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white h-24 flex items-center justify-around z-50 px-2 pb-2 rounded-t-4xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = isActive ? item.iconFill : item.iconLine;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 group ${isActive
              ? "text-brand-red"
              : "text-brand-gray hover:text-brand-black"
              }`}
          >
            <div
              className={`relative mb-1 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"
                }`}
            >
              <Icon size={24} />
              {item.label === "Chat" && MOCK_CHATS.reduce((acc, chat) => acc + chat.unreadCount, 0) > 0 && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

