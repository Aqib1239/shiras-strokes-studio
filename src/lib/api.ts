const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // Relative path so Next.js rewrites proxy to backend
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper to get auth header
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("shiras_admin_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface ProductData {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  category: string;
  categoryLabel?: string;
  price: number;
  description: string;
  materials?: string;
  image: string;
  images?: string[];
  customisable?: boolean;
  featured?: boolean;
  handmade?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  newest?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewData {
  _id?: string;
  name: string;
  occasion?: string;
  rating: number;
  text: string;
  photo?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  totalReviews: number;
  publishedReviews: number;
  recentProducts: ProductData[];
  recentReviews: ReviewData[];
  system: {
    databaseConnected: boolean;
    cloudinaryConfigured: boolean;
    nodeEnv: string;
  };
}

export const api = {
  // Public Products
  async getProducts(params?: { category?: string; featured?: boolean; search?: string; includeInactive?: boolean }) {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") query.set("category", params.category);
    if (params?.featured) query.set("featured", "true");
    if (params?.search) query.set("search", params.search);
    if (params?.includeInactive) query.set("includeInactive", "true");

    const res = await fetch(`${API_BASE_URL}/api/products?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async getProductById(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product details");
    return res.json();
  },

  // Admin Products CRUD
  async createProduct(data: Partial<ProductData>) {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to create product");
    return result;
  },

  async updateProduct(id: string, data: Partial<ProductData>) {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update product");
    return result;
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete product");
    return result;
  },

  // Public Reviews
  async getReviews(params?: { includeUnpublished?: boolean; featured?: boolean }) {
    const query = new URLSearchParams();
    if (params?.includeUnpublished) query.set("includeUnpublished", "true");
    if (params?.featured) query.set("featured", "true");

    const res = await fetch(`${API_BASE_URL}/api/reviews?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  },

  // Admin Reviews CRUD
  async createReview(data: Partial<ReviewData>) {
    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to create review");
    return result;
  },

  async updateReview(id: string, data: Partial<ReviewData>) {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update review");
    return result;
  },

  async deleteReview(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete review");
    return result;
  },

  // Admin Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Invalid email or password");
    return result;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update password");
    return result;
  },

  // Admin Dashboard Stats
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    const res = await fetch(`${API_BASE_URL}/api/stats`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch statistics");
    return res.json();
  },

  // Image Upload
  async uploadImages(files: File[]) {
    const token = typeof window !== "undefined" ? localStorage.getItem("shiras_admin_token") : null;
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to upload image");
    return result;
  },
};
