export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  province: string;
  regency: string;
  district: string;
  village: string;
}

export interface User {
  id: string;
  uid: string; // Firebase User ID (for compatibility)
  name: string;
  email?: string;
  avatar?: string;
  address?: Address;
  coordinates?: Coordinates;
  bio?: string;
  locationLabel?: string;
  isVerified?: boolean;
  joinDate?: string;
  onboardingCompleted: boolean;
}
