import { getBookRepository } from "@/repositories/book.repository";
import { Book } from "@/types/book";

export const bookService = {
  /**
   * Get all books
   * Dev Mode: Returns from localStorage, initializes with mock data if empty
   * TODO: Replace with Supabase when ready
   */
  getAllBooks: async (): Promise<Book[]> => {
    const repo = getBookRepository();
    return repo.getAllBooks();
  },

  /**
   * Get book by ID
   * Dev Mode: Returns from localStorage
   * TODO: Replace with Supabase when ready
   */
  getBookById: async (bookId: string): Promise<Book | null> => {
    const repo = getBookRepository();
    return repo.getBookById(bookId);
  },

  /**
   * Get books by category
   * Dev Mode: Filters from localStorage
   * TODO: Replace with Supabase when ready
   */
  getBooksByCategory: async (
    category: Book["category"] | "Semua"
  ): Promise<Book[]> => {
    const repo = getBookRepository();
    return repo.getBooksByCategory(category);
  },

  /**
   * Get trending books
   * Dev Mode: Filters from localStorage
   * TODO: Replace with Supabase when ready
   */
  getTrendingBooks: async (): Promise<Book[]> => {
    const repo = getBookRepository();
    return repo.getTrendingBooks();
  },

  /**
   * Create a new book
   * Dev Mode: Saves to localStorage
   * TODO: Replace with Supabase when ready
   */
  createBook: async (book: Omit<Book, "id">): Promise<Book> => {
    const repo = getBookRepository();
    return repo.createBook(book);
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
    const repo = getBookRepository();
    return repo.updateBook(bookId, updates);
  },

  /**
   * Delete a book
   * Dev Mode: Deletes from localStorage
   * TODO: Replace with Supabase when ready
   */
  deleteBook: async (bookId: string): Promise<boolean> => {
    const repo = getBookRepository();
    return repo.deleteBook(bookId);
  },

  /**
   * Search books by title or author
   * Dev Mode: Searches in localStorage
   * TODO: Replace with Supabase when ready
   */
  searchBooks: async (query: string): Promise<Book[]> => {
    const repo = getBookRepository();
    return repo.searchBooks(query);
  },
};
