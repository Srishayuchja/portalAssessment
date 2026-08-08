export type ProductStatus = 'DRAFT' | 'PUBLISHED';
export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';

export interface Category {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  discountPrice: string | null;
  taxIncluded: boolean;
  expirationStart: string | null;
  expirationEnd: string | null;
  stockQuantity: number;
  unlimitedStock: boolean;
  stockStatus: StockStatus;
  featured: boolean;
  totalOrders: number;
  images: string[];
  tags: string[];
  colors: string[];
  status: ProductStatus;
  categoryId: string | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  taxIncluded?: boolean;
  expirationStart?: string;
  expirationEnd?: string;
  stockQuantity?: number;
  unlimitedStock?: boolean;
  stockStatus?: StockStatus;
  featured?: boolean;
  images?: string[];
  tags?: string[];
  colors?: string[];
  status?: ProductStatus;
  categoryId?: string;
}
