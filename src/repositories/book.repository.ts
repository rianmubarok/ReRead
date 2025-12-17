import { Book } from "@/types/book";
import { User } from "@/types/user";
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
  getBooksByOwner(ownerId: string): Promise<Book[]>;
  getTrendingBooks(): Promise<Book[]>;
  createBook(book: Omit<Book, "id">): Promise<Book>;
  updateBook(bookId: string, updates: Partial<Book>): Promise<Book | null>;
  deleteBook(bookId: string): Promise<boolean>;
  searchBooks(query: string): Promise<Book[]>;

  // Bookmark methods
  toggleBookmark(bookId: string, userId: string): Promise<boolean>; // returns isBookmarked state
  isBookmarked(bookId: string, userId: string): Promise<boolean>;
  getBookmarks(userId: string): Promise<Book[]>;
}

class MockBookRepository implements BookRepository {
  private _bookmarks: Set<string> = new Set(); // simple in-memory mock

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

  async getBooksByOwner(ownerId: string): Promise<Book[]> {
    await maybeDelay(300);
    const books = getBooks();
    return books.filter((b) => b.owner.id === ownerId);
  }

  async getTrendingBooks(): Promise<Book[]> {
    await maybeDelay(300);
    const books = getBooks();
    return books.slice(0, 5);
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

  async toggleBookmark(bookId: string, userId: string): Promise<boolean> {
    await maybeDelay(200);
    const key = `${userId}:${bookId}`;
    if (this._bookmarks.has(key)) {
      this._bookmarks.delete(key);
      return false;
    }
    this._bookmarks.add(key);
    return true;
  }

  async isBookmarked(bookId: string, userId: string): Promise<boolean> {
    return this._bookmarks.has(`${userId}:${bookId}`);
  }

  async getBookmarks(userId: string): Promise<Book[]> {
    // In mock, we can't easily join, but assuming all books loaded
    const books = getBooks();
    return books.filter(b => this._bookmarks.has(`${userId}:${b.id}`));
  }
}

const mapToBook = (data: any): Book => {
  // Handle case where users might be missing or different structure
  const user = data.users || {};

  const owner: User = {
    id: user.uid || user.id || "",
    uid: user.uid || "",
    name: user.name || "Unknown",
    email: user.email,
    avatar: user.avatar,
    address: user.address,
    coordinates: user.coordinates,
    bio: user.bio,
    locationLabel: user.location_label,
    isVerified: user.is_verified,
    joinDate: user.join_date,
    onboardingCompleted: user.onboarding_completed,
  };

  return {
    id: data.id,
    title: data.title,
    author: data.author,
    image: data.image,
    description: data.description,
    category: data.category as any,
    condition: data.condition as any,
    owner: owner,
    exchangeMethods: data.exchange_methods,
    createdAt: data.created_at,
    locationLabel: owner.locationLabel,
    coordinates: owner.coordinates,
    distanceLabel: undefined,
    status: data.status || 'available',
  };
};

class SupabaseBookRepository implements BookRepository {
  async getAllBooks(): Promise<Book[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("books")
      .select("*, users(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      return [];
    }

    return (data || []).map(mapToBook);
  }

  async getBookById(bookId: string): Promise<Book | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("books")
      .select("*, users(*)")
      .eq("id", bookId)
      .single();

    if (error || !data) {
      return null;
    }
    return mapToBook(data);
  }

  async getBooksByCategory(category: Book["category"] | "Semua"): Promise<Book[]> {
    if (!supabase) return [];

    let query = supabase
      .from("books")
      .select("*, users(*)")
      .order("created_at", { ascending: false });

    if (category !== "Semua") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching books by category:", error);
      return [];
    }
    return (data || []).map(mapToBook);
  }

  async getBooksByOwner(ownerId: string): Promise<Book[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("books")
      .select("*, users(*)")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user books:", error);
      return [];
    }

    return (data || []).map(mapToBook);
  }

  async getTrendingBooks(): Promise<Book[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("books")
      .select("*, users(*)")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching trending books:", error);
      return [];
    }
    return (data || []).map(mapToBook);
  }

  async createBook(book: Omit<Book, "id">): Promise<Book> {
    if (!supabase) throw new Error("Supabase client not initialized");

    const ownerUid = book.owner?.uid;
    if (!ownerUid) throw new Error("Book owner UID is missing");

    const { data: userRow } = await supabase
      .from("users")
      .select("id")
      .eq("uid", ownerUid)
      .single();

    if (!userRow) throw new Error("User profile not found in database for uid: " + ownerUid);

    const payload = {
      title: book.title,
      author: book.author,
      image: book.image,
      description: book.description,
      category: book.category,
      condition: book.condition,
      owner_id: userRow.id,
      exchange_methods: book.exchangeMethods,
      status: 'Available',
    };

    const { data, error } = await supabase
      .from("books")
      .insert(payload)
      .select("*, users(*)")
      .single();

    if (error) {
      console.error("Error creating book:", error);
      throw error;
    }

    return mapToBook(data);
  }

  async updateBook(bookId: string, updates: Partial<Book>): Promise<Book | null> {
    if (!supabase) return null;

    if (updates.image) {
      const { data: oldBook } = await supabase
        .from("books")
        .select("image")
        .eq("id", bookId)
        .single();

      if (oldBook?.image && oldBook.image !== updates.image) {
        try {
          const urlParts = oldBook.image.split('/book-covers/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            await supabase.storage.from('book-covers').remove([filePath]);
          }
        } catch (err) {
          console.error("Failed to delete old book cover:", err);
        }
      }
    }

    const payload: any = {};
    if (updates.title) payload.title = updates.title;
    if (updates.author) payload.author = updates.author;
    if (updates.image) payload.image = updates.image;
    if (updates.description) payload.description = updates.description;
    if (updates.category) payload.category = updates.category;
    if (updates.condition) payload.condition = updates.condition;
    if (updates.exchangeMethods) payload.exchange_methods = updates.exchangeMethods;
    if (updates.status) payload.status = updates.status;

    const { data, error } = await supabase
      .from("books")
      .update(payload)
      .eq("id", bookId)
      .select("*, users(*)")
      .single();

    if (error) {
      console.error("Error updating book:", error);
      return null;
    }

    return mapToBook(data);
  }

  async deleteBook(bookId: string): Promise<boolean> {
    if (!supabase) return false;

    const { data: oldBook } = await supabase
      .from("books")
      .select("image")
      .eq("id", bookId)
      .single();

    if (oldBook?.image) {
      try {
        const urlParts = oldBook.image.split('/book-covers/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from('book-covers').remove([filePath]);
        }
      } catch (err) {
        console.error("Failed to delete book cover during book deletion:", err);
      }
    }

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", bookId);

    if (error) {
      console.error("Error deleting book:", error);
      return false;
    }
    return true;
  }

  async searchBooks(query: string): Promise<Book[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("books")
      .select("*, users(*)")
      .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching books:", error);
      return [];
    }

    return (data || []).map(mapToBook);
  }

  async isBookmarked(bookId: string, userId: string): Promise<boolean> {
    if (!supabase) return false;
    const { count } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("book_id", bookId)
      .eq("user_id", userId);
    return (count || 0) > 0;
  }

  async toggleBookmark(bookId: string, userId: string): Promise<boolean> {
    if (!supabase) return false;

    const exists = await this.isBookmarked(bookId, userId);
    if (exists) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("book_id", bookId)
        .eq("user_id", userId);
      return false;
    } else {
      await supabase
        .from("bookmarks")
        .insert([{ book_id: bookId, user_id: userId }]);
      return true;
    }
  }

  async getBookmarks(userId: string): Promise<Book[]> {
    if (!supabase) return [];

    // Join books via book_id
    // Referencing foreign key logic in supabase-js select
    const { data, error } = await supabase
      .from("bookmarks")
      .select("book:books(*, users(*))")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return [];
    }

    // data is array of { book: { ...bookData, users: {...userData} } }
    const books = data.map((item: any) => mapToBook(item.book)).filter(b => !!b);
    return books;
  }
}

export const getBookRepository = (): BookRepository => {
  if (supabase) {
    return new SupabaseBookRepository();
  }
  return new MockBookRepository();
};
