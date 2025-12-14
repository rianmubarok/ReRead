export function parseMockDate(dateStr: string): Date {
    const now = new Date();

    // Format: HH:mm (e.g., "09:12")
    if (/^\d{1,2}:\d{2}$/.test(dateStr)) {
        const [hours, minutes] = dateStr.split(":").map(Number);
        const date = new Date(now);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    // Format: Yesterday
    if (dateStr.toLowerCase() === "yesterday" || dateStr.toLowerCase() === "kemarin") {
        const date = new Date(now);
        date.setDate(date.getDate() - 1);
        return date;
    }

    // Format: DD/MM/YY (e.g., "07/12/25")
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
        const parts = dateStr.split("/");
        // Assuming DD/MM/YY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
        return new Date(year, month, day, 12, 0); // Set to noon to avoid timezone shift issues ending up on previous day
    }

    // Format: Day Name (e.g., "Senin") - just return past date random or specific logic?
    // For now fallback to simple parsing or just return now if invalid
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
        return parsed;
    }

    return now;
}

export function formatMessageTime(date: Date): string {
    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).replace(".", ":");
}

export function formatChatDate(date: Date): string {
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();

    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();

    if (isToday) {
        return "Hari Ini";
    }

    if (isYesterday) {
        return "Kemarin";
    }

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}
