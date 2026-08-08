import type {
  Category,
  CreateProductInput,
  LoginResponse,
  PaginatedResponse,
  Product,
  ProductStatus,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'dealport_token';
export const USER_KEY = 'dealport_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

// remember=true persists the session across browser restarts (localStorage);
// remember=false keeps it only for the current tab session (sessionStorage).
export function setToken(token: string, remember: boolean) {
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401 && token) {
      // Stale/expired token: clear the session and bounce back to login instead of
      // leaving the user stuck on a page where every request silently fails.
      clearToken();
      localStorage.removeItem(USER_KEY);
      window.location.assign('/login');
    }

    const body = await res.json().catch(() => ({}) as { message?: string });
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : (body.message ?? `Request failed with status ${res.status}`);
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export interface ProductQuery {
  search?: string;
  page?: number;
  limit?: number;
  status?: ProductStatus;
  categoryId?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'totalOrders';
  sortOrder?: 'asc' | 'desc';
}

function buildQuery<T extends object>(params: T): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const api = {
  login(email: string, password: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProducts(query: ProductQuery = {}) {
    return request<PaginatedResponse<Product>>(`/products${buildQuery(query)}`);
  },

  getProduct(id: string) {
    return request<Product>(`/products/${id}`);
  },

  createProduct(input: CreateProductInput) {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateProduct(id: string, input: Partial<CreateProductInput>) {
    return request<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  deleteProduct(id: string) {
    return request<{ id: string }>(`/products/${id}`, { method: 'DELETE' });
  },

  getCategories() {
    return request<Category[]>('/categories');
  },
};

export { ApiError };
