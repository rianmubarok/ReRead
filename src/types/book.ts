import { User } from "./user";

export type BookCategory =
  | "Fiksi"
  | "Non-Fiksi"
  | "Pendidikan"
  | "Komik"
  | "Sastra"
  | "Biografi"
  | "Teknologi"
  | "Seni"
  | "Agama"
  | "Hobi";

export type BookCondition = "Baru" | "Baik" | "Bekas";
export type ExchangeMethod =
  | "Nego"
  | "Barter"
  | "Gratis / Dipinjamkan";

export interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  category: BookCategory;
  condition: BookCondition;
  owner: User;
  exchangeMethods?: ExchangeMethod[];
  createdAt: string;
  locationLabel?: string;
  distanceLabel?: string;
  coordinates?: User["coordinates"];
  status?: "Available" | "Archived" | "Exchanged";
}
