import { supabase } from "@/lib/supabase";

export interface ExchangeTransaction {
    id: string;
    requesterId: string;
    responderId: string;
    bookId: string;
    barterBookId?: string;
    status: string;
    createdAt: Date;
}

export interface TransactionRepository {
    createTransaction(transaction: Omit<ExchangeTransaction, 'id' | 'createdAt'>): Promise<ExchangeTransaction | null>;
    getTransactionsByUserId(userId: string): Promise<ExchangeTransaction[]>;
}

class SupabaseTransactionRepository implements TransactionRepository {
    async createTransaction(transaction: Omit<ExchangeTransaction, 'id' | 'createdAt'>): Promise<ExchangeTransaction | null> {
        if (!supabase) return null;

        const payload = {
            requester_id: transaction.requesterId,
            responder_id: transaction.responderId,
            book_id: transaction.bookId,
            barter_book_id: transaction.barterBookId || null,
            status: transaction.status,
        };

        const { data, error } = await supabase
            .from('exchange_transactions')
            .insert(payload)
            .select('*')
            .single();

        if (error) {
            console.error("Failed to create transaction record:", error);
            return null;
        }

        return {
            id: data.id,
            requesterId: data.requester_id,
            responderId: data.responder_id,
            bookId: data.book_id,
            barterBookId: data.barter_book_id,
            status: data.status,
            createdAt: new Date(data.created_at)
        };
    }

    async getTransactionsByUserId(userId: string): Promise<ExchangeTransaction[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('exchange_transactions')
            .select('*')
            .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Failed to fetch transactions:", error);
            return [];
        }

        return data.map((d: any) => ({
            id: d.id,
            requesterId: d.requester_id,
            responderId: d.responder_id,
            bookId: d.book_id,
            barterBookId: d.barter_book_id,
            status: d.status,
            createdAt: new Date(d.created_at)
        }));
    }
}

class MockTransactionRepository implements TransactionRepository {
    async createTransaction(transaction: Omit<ExchangeTransaction, 'id' | 'createdAt'>): Promise<ExchangeTransaction | null> {
        console.log("Mock Transaction Created:", transaction);
        return {
            ...transaction,
            id: `trans-${Date.now()}`,
            createdAt: new Date()
        };
    }

    async getTransactionsByUserId(userId: string): Promise<ExchangeTransaction[]> {
        return [];
    }
}

export const getTransactionRepository = (): TransactionRepository => {
    if (supabase) return new SupabaseTransactionRepository();
    return new MockTransactionRepository();
};
