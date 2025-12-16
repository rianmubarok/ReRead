import { Book } from "@/types/book";
import { DEV_MODE, maybeDelay } from "@/utils/constants";
import { supabase } from "@/lib/supabase";
import {
  getBooks,
  saveBooks,
  addBook,
  updateBook as updateBookStorage,
  deleteBook,
  getBookById,
} from "@/storage/book.storage";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { generateId } from "@/utils/id";

export interface BookRepository {
  getAllBooks(): Promise<Book[]>;
  getBookById(bookId: string): Promise<Book | null>;
  getBooksByCategory(category: Book["category"] | "Semua"): Promise<Book[]>;
  getTrendingBooks(): Promise<Book[]>;
  createBook(book: Omit<Book, "id">): Promise<Book>;
  updateBook(bookId: string, updates: Partial<Book>): Promise<Book | null>;
  deleteBook(bookId: string): Promise<boolean>;
  searchBooks(query: string): Promise<Book[]>;
}

class MockBookRepository implements BookRepository {
  private initializeBooks() {
    const existing = getBooks();
    if (existing.length === 0) {
      saveBooks(MOCK_BOOKS);
    }
  }

  async getAllBooks(): Promise<Book[]> {
    await maybeDelay(300);
    this.initializeBooks();
    return getBooks();
  }

  async getBookById(bookId: string): Promise<Book | null> {
    await maybeDelay(200);
    return getBookById(bookId);
  }

  async getBooksByCategory(category: Book["category"] | "Semua"): Promise<Book[]> {
    await maybeDelay(300);
    const books = getBooks();
    if (category === "Semua") return books;
    return books.filter((b) => b.category === category);
  }

  async getTrendingBooks(): Promise<Book[]> {
    await maybeDelay(300);
    const books = getBooks();
    return books.filter((b) => b.isTrending === true);
  }

  async createBook(book: Omit<Book, "id">): Promise<Book> {
    await maybeDelay(500);
    const newBook: Book = { ...book, id: generateId("book") };
    addBook(newBook);
    return newBook;
  }

  async updateBook(bookId: string, updates: Partial<Book>): Promise<Book | null> {
    await maybeDelay(400);
    const success = updateBookStorage(bookId, updates);
    if (!success) return null;
    return getBookById(bookId);
  }

  async deleteBook(bookId: string): Promise<boolean> {
    await maybeDelay(400);
    return deleteBook(bookId);
  }

  async searchBooks(query: string): Promise<Book[]> {
    await maybeDelay(300);
    const books = getBooks();
    const q = query.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }
}

class SupabaseBookRepository implements BookRepository {
  async getAllBooks(): Promise<Book[]> {
    // TODO: implement Supabase query
    return [];
  }
  async getBookById(_bookId: string): Promise<Book | null> {
    return null;
  }
  async getBooksByCategory(_category: Book["category"] | "Semua"): Promise<Book[]> {
    return [];
  }
  async getTrendingBooks(): Promise<Book[]> {
    return [];
  }
  async createBook(_book: Omit<Book, "id">): Promise<Book> {
    throw new Error("Supabase repository not implemented");
  }
  async updateBook(_bookId: string, _updates: Partial<Book>): Promise<Book | null> {
    return null;
  }
  async deleteBook(_bookId: string): Promise<boolean> {
    return false;
  }
  async searchBooks(_query: string): Promise<Book[]> {
    return [];
  }
}

export const getBookRepository = (): BookRepository => {
  if (!DEV_MODE && supabase) {
    return new SupabaseBookRepository();
  }
  return new MockBookRepository();
};

