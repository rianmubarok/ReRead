import { Book } from "@/data/mockBooks";
import {
  getBooks,
  saveBooks,
  addBook,
  updateBook as updateBookStorage,
  deleteBook,
  getBookById,
} from "@/storage/book.storage";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { delay, DEV_MODE } from "@/utils/constants";
import { generateId } from "@/utils/id";

/**
 * Initialize books storage with mock data if empty
 */
const initializeBooks = (): void => {
  const existingBooks = getBooks();
  if (existingBooks.length === 0 && DEV_MODE) {
    saveBooks(MOCK_BOOKS);
  }
};

export const bookService = {
  /**
   * Get all books
   * Dev Mode: Returns from localStorage, initializes with mock data if empty
   * TODO: Replace with Supabase when ready
   */
  getAllBooks: async (): Promise<Book[]> => {
    await delay(300); // Simulate network latency

    if (DEV_MODE) {
      initializeBooks();
      return getBooks();
    }

    // TODO: Replace with Supabase query
    // return await supabase.from('books').select('*');
    return [];
  },

  /**
   * Get book by ID
   * Dev Mode: Returns from localStorage
   * TODO: Replace with Supabase when ready
   */
  getBookById: async (bookId: string): Promise<Book | null> => {
    await delay(200);

    if (DEV_MODE) {
      return getBookById(bookId);
    }

    // TODO: Replace with Supabase query
    // return await supabase.from('books').select('*').eq('id', bookId).single();
    return null;
  },

  /**
   * Get books by category
   * Dev Mode: Filters from localStorage
   * TODO: Replace with Supabase when ready
   */
  getBooksByCategory: async (
    category: Book["category"] | "Semua"
  ): Promise<Book[]> => {
    await delay(300);

    if (DEV_MODE) {
      const books = getBooks();
      if (category === "Semua") {
        return books;
      }
      return books.filter((book) => book.category === category);
    }

    // TODO: Replace with Supabase query
    return [];
  },

  /**
   * Get trending books
   * Dev Mode: Filters from localStorage
   * TODO: Replace with Supabase when ready
   */
  getTrendingBooks: async (): Promise<Book[]> => {
    await delay(300);

    if (DEV_MODE) {
      const books = getBooks();
      return books.filter((book) => book.isTrending === true);
    }

    // TODO: Replace with Supabase query
    return [];
  },

  /**
   * Create a new book
   * Dev Mode: Saves to localStorage
   * TODO: Replace with Supabase when ready
   */
  createBook: async (book: Omit<Book, "id">): Promise<Book> => {
    await delay(500);

    const newBook: Book = {
      ...book,
      id: generateId("book"),
    };

    if (DEV_MODE) {
      addBook(newBook);
    }

    // TODO: Replace with Supabase insert
    // return await supabase.from('books').insert(newBook).select().single();
    return newBook;
  },

  /**
   * Update a book
   * Dev Mode: Updates in localStorage
   * TODO: Replace with Supabase when ready
   */
  updateBook: async (
    bookId: string,
    updates: Partial<Book>
  ): Promise<Book | null> => {
    await delay(400);

    if (DEV_MODE) {
      const success = updateBookStorage(bookId, updates);
      if (success) {
        return getBookById(bookId);
      }
      return null;
    }

    // TODO: Replace with Supabase update
    // return await supabase.from('books').update(updates).eq('id', bookId).select().single();
    return null;
  },

  /**
   * Delete a book
   * Dev Mode: Deletes from localStorage
   * TODO: Replace with Supabase when ready
   */
  deleteBook: async (bookId: string): Promise<boolean> => {
    await delay(400);

    if (DEV_MODE) {
      return deleteBook(bookId);
    }

    // TODO: Replace with Supabase delete
    // const { error } = await supabase.from('books').delete().eq('id', bookId);
    // return !error;
    return false;
  },

  /**
   * Search books by title or author
   * Dev Mode: Searches in localStorage
   * TODO: Replace with Supabase when ready
   */
  searchBooks: async (query: string): Promise<Book[]> => {
    await delay(300);

    if (DEV_MODE) {
      const books = getBooks();
      const lowerQuery = query.toLowerCase();
      return books.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery)
      );
    }

    // TODO: Replace with Supabase search
    return [];
  },
};
