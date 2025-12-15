"use client";

import React from "react";
import { RiSearchLine, RiMore2Fill } from "@remixicon/react";

export default function BookmarksHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-brand-white px-6 border-b border-gray-100 z-50">
      <div className="flex items-center gap-4 py-6 pt-6">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari simpanan"
            className="w-full bg-gray-100 text-brand-black rounded-full pl-11 pr-4 py-3.5 placeholder:text-brand-gray focus:outline-none focus:ring-1 focus:ring-brand-red/50 transition-shadow"
          />
        </div>

        {/* Menu Button */}
        <button className="p-2 -mr-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
          <RiMore2Fill className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
