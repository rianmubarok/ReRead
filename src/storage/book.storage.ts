import { Book } from "@/data/mockBooks";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const KEY = "reread_books";

/**
 * Get all books from localStorage
 * @returns Array of Book objects or empty array if not found
 */
export const getBooks = (): Book[] => {
  const books = getStorageItem<Book[]>(KEY);
  return Array.isArray(books) ? books : [];
};

/**
 * Save books array to localStorage
 * @param books Array of Book objects to save
 */
export const saveBooks = (books: Book[]): void => {
  setStorageItem(KEY, books);
};

/**
 * Add a single book to localStorage
 * @param book Book object to add
 */
export const addBook = (book: Book): void => {
  const books = getBooks();
  books.push(book);
  saveBooks(books);
};

/**
 * Update a book in localStorage
 * @param bookId ID of the book to update
 * @param updates Partial Book object with fields to update
 */
export const updateBook = (bookId: string, updates: Partial<Book>): boolean => {
  const books = getBooks();
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) return false;

  books[index] = { ...books[index], ...updates };
  saveBooks(books);
  return true;
};

/**
 * Delete a book from localStorage
 * @param bookId ID of the book to delete
 */
export const deleteBook = (bookId: string): boolean => {
  const books = getBooks();
  const filtered = books.filter((b) => b.id !== bookId);

  if (filtered.length === books.length) return false;

  saveBooks(filtered);
  return true;
};

/**
 * Get a single book by ID
 * @param bookId ID of the book to get
 * @returns Book object or null if not found
 */
export const getBookById = (bookId: string): Book | null => {
  const books = getBooks();
  return books.find((b) => b.id === bookId) || null;
};
