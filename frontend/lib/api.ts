import { supabase } from './supabase';

// Base URL for the backend API
const API_BASE_URL = 'https://scansavvy-api.onrender.com';

/**
 * Get authorization header with Supabase token
 */
async function getAuthHeader(): Promise<{ Authorization: string } | {}> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  }
  
  return {};
}

/**
 * API Client
 */
export const api = {
  /**
   * Create a QR session
   */
  async createSession(userId: string, retailer: string, storeId?: string) {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/sessions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({
        userId,
        retailer,
        storeId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create session');
    }

    return response.json();
  },

  /**
   * Validate a QR session
   */
  async validateSession(sessionId: string, qrToken: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/sessions/${sessionId}/validate`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${qrToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to validate session');
    }

    return response.json();
  },

  /**
   * Get nearby stores
   */
  async getNearbyStores(latitude: number, longitude: number, radius: number = 0.5) {
    const authHeader = await getAuthHeader();
    
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radius.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/stores/nearby?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get nearby stores');
    }

    return response.json();
  },

  /**
   * Get coupons for a retailer
   */
  async getCoupons(retailer: string, category?: string, limit: number = 20) {
    const authHeader = await getAuthHeader();
    
    const params = new URLSearchParams({ limit: limit.toString() });
    if (category) params.append('category', category);

    const response = await fetch(
      `${API_BASE_URL}/api/coupons/${retailer}?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get coupons');
    }

    return response.json();
  },

  /**
   * Clip coupons
   */
  async clipCoupons(userId: string, couponIds: string[]) {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/coupons/clip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({
        userId,
        couponIds,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to clip coupons');
    }

    return response.json();
  },

  /**
   * Unclip a coupon
   */
  async unclipCoupon(userId: string, couponId: string) {
    const authHeader = await getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}/api/coupons/unclip`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({
        userId,
        couponId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to unclip coupon');
    }

    return response.json();
  },

  /**
   * Health check
   */
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};

export default api;
