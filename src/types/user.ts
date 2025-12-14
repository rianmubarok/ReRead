export interface User {
    id: string;
    uid: string; // Firebase User ID (for compatibility)
    name: string;
    email?: string;
    avatar?: string;
    address?: {
        province: string;
        regency: string;
        district: string;
        village: string;
    };
    onboardingCompleted: boolean;
}
