export interface EventWithCategory {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  location: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  isFree: boolean;
  imageUrl: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  categoryId: string;
  organizerId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  organizer: {
    id: string;
    name: string | null;
  };
  _count?: {
    savedBy: number;
  };
}

export interface SearchFilters {
  query?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  isFree?: boolean;
  lat?: number;
  lng?: number;
  radius?: number;
}
