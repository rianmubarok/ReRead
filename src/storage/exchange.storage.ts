import { getStorageItem, setStorageItem } from "@/utils/storage";
import { generateId } from "@/utils/id";

export type ExchangeType = "Beli" | "Barter";

export interface ExchangeHistoryItem {
  id: string;
  chatId: string;
  bookId: string;
  partnerId: string;
  note?: string;
  createdAt: string; // ISO string
}

const KEY = "reread_exchange_history";

export const getExchangeHistory = (): ExchangeHistoryItem[] => {
  const data = getStorageItem<ExchangeHistoryItem[]>(KEY);
  if (!Array.isArray(data)) return [];

  // Deduplicate by (chatId, bookId, partnerId, note)
  const map = new Map<string, ExchangeHistoryItem>();
  for (const item of data) {
    const key = `${item.chatId}-${item.bookId}-${item.partnerId}-${
      item.note ?? ""
    }`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  const deduped = Array.from(map.values());
  if (deduped.length !== data.length) {
    setStorageItem(KEY, deduped);
  }
  return deduped;
};

export const addExchangeHistory = (
  item: Omit<ExchangeHistoryItem, "id" | "createdAt">
): ExchangeHistoryItem => {
  const existing = getExchangeHistory();

  const key = `${item.chatId}-${item.bookId}-${item.partnerId}-${
    item.note ?? ""
  }`;
  const already = existing.find(
    (e) => `${e.chatId}-${e.bookId}-${e.partnerId}-${e.note ?? ""}` === key
  );
  if (already) return already;

  const newItem: ExchangeHistoryItem = {
    ...item,
    id: generateId("exchange"),
    createdAt: new Date().toISOString(),
  };
  setStorageItem(KEY, [...existing, newItem]);
  return newItem;
};
