import React, { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine, RiSearchLine } from "@remixicon/react";

interface Option {
    code: string;
    name: string;
}

interface SearchableDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
}

export default function SearchableDropdown({
    options,
    value,
    onChange,
    placeholder,
    disabled = false,
    isLoading = false,
    className = "",
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.code === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter((opt) =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (code: string) => {
        onChange(code);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled || isLoading}
                className={`w-full bg-gray-100 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-200 border border-transparent
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"}
        ${isOpen ? "ring-2 ring-brand-red/20 bg-white" : ""}
        `}
            >
                <span
                    className={`text-sm truncate ${selectedOption ? "text-brand-black" : "text-brand-gray"
                        }`}
                >
                    {isLoading
                        ? "Loading..."
                        : selectedOption
                            ? selectedOption.name
                            : placeholder}
                </span>
                <RiArrowDownSLine
                    className={`w-5 h-5 text-brand-gray transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up origin-top">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari..."
                                className="w-full bg-gray-50 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-red/50 text-brand-black"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt.code}
                                    type="button"
                                    onClick={() => handleSelect(opt.code)}
                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors
                  ${value === opt.code
                                            ? "text-brand-red font-medium bg-brand-red/5"
                                            : "text-brand-black"
                                        }
                  `}
                                >
                                    {opt.name}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-brand-gray text-center">
                                Tidak ditemukan
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
