export const LISTING_TYPES = ["ขาย", "เช่า"] as const;

export type ListingType = (typeof LISTING_TYPES)[number];

export type Agent = {
  name: string;
  phone: string;
  email: string;
};

export type Property = {
  id: number;
  type: ListingType;
  title: string;
  location: string;
  price: number;
  image: string;
  category?: string;
  propertyType?: string;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  pricePerSqm?: number;
  description?: string;
  features?: string[];
  lat?: number;
  lng?: number;
  agent?: Agent;
  images?: string[];
  createdAt: string;
  updatedAt: string;
};

export type PropertyInput = Partial<Omit<Property, "id" | "createdAt" | "updatedAt">>;
