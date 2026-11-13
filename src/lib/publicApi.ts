/**
 * Public API utility functions for fetching public data
 */

const PUBLIC_API_BASE = '/api/public';

export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  isOnSale: boolean;
  stock: number;
  introImage: string;
  images: string[];
  isFeatured: boolean;
  category: {
    id: number;
    name: string;
  };
}

export interface PublicCategory {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

/**
 * Fetch all published products
 */
export async function getPublicProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<PublicProduct[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured) searchParams.append('featured', 'true');

    const url = `${PUBLIC_API_BASE}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 */
export async function getPublicProduct(id: string): Promise<PublicProduct | null> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(): Promise<PublicProduct[]> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/products/featured`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Fetch all categories
 */
export async function getPublicCategories(): Promise<PublicCategory[]> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Create an order
 */
export async function createPublicOrder(orderData: {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    product_id: string;
    quantity: number;
    size?: string;
    color?: string;
  }>;
}): Promise<{ success: boolean; message: string; order?: any }> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create order');
    }
    
    return data;
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw error;
  }
}

