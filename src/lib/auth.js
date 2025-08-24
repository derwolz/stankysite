// src/lib/auth.js
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

// Configuration
const API_BASE_URL = 'http://localhost:8000';
const BOOK_SITE_API_KEY = 'your-book-site-api-key'; // Replace with your actual API key

// Auth store
export const authStore = writable({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null
});

/**
 * Make an authenticated request to your Django API
 * This will include both the JWT access token and X-API-Key header
 * @param {string} endpoint - The API endpoint (e.g., '/api/user/profile/')
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function authenticatedFetch(endpoint, options = {}) {
    if (!browser) {
        throw new Error('authenticatedFetch can only be used in the browser');
    }
    
    // Get current auth state
    let currentAuth;
    authStore.subscribe(auth => {
        currentAuth = auth;
    })();
    
    if (!currentAuth.isAuthenticated || !currentAuth.accessToken) {
        throw new Error('User is not authenticated');
    }
    
    // Prepare headers
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': BOOK_SITE_API_KEY,
        'Authorization': `Bearer ${currentAuth.accessToken}`,
        ...options.headers
    };
    
    // Build full URL
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Make the request
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // Handle 401 responses by trying to refresh token
    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry the request with new token
            const newAuth = get(authStore);
            headers['Authorization'] = `Bearer ${newAuth.accessToken}`;
            return fetch(url, { ...options, headers });
        } else {
            // Refresh failed, clear auth state
            logout();
            throw new Error('Authentication expired');
        }
    }
    
    return response;
}

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<boolean>}
 */
export async function refreshAccessToken() {
    if (!browser) return false;
    
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return false;
        
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': BOOK_SITE_API_KEY
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update tokens
            localStorage.setItem('access_token', data.access);
            if (data.refresh) {
                localStorage.setItem('refresh_token', data.refresh);
            }
            
            // Update auth store
            authStore.update(auth => ({
                ...auth,
                accessToken: data.access,
                refreshToken: data.refresh || auth.refreshToken
            }));
            
            return true;
        }
    } catch (error) {
        console.error('Token refresh error:', error);
    }
    
    return false;
}

/**
 * Get user profile data from your API
 * @returns {Promise<object>}
 */
export async function getUserProfile() {
    try {
        const response = await authenticatedFetch('/api/user/profile/');
        
        if (response.ok) {
            const userData = await response.json();
            
            // Update user data in store
            authStore.update(auth => ({
                ...auth,
                user: userData
            }));
            
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } else {
            throw new Error(`Failed to get user profile: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Get user profile error:', error);
        throw error;
    }
}

/**
 * Check if user is authenticated and restore from localStorage
 * @returns {Promise<boolean>}
 */
export async function checkAuthStatus() {
    if (!browser) return false;
    
    try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userData = localStorage.getItem('user');
        
        if (accessToken && userData) {
            authStore.set({
                isAuthenticated: true,
                user: JSON.parse(userData),
                accessToken: accessToken,
                refreshToken: refreshToken
            });
            
            // Optionally verify token is still valid
            try {
                await getUserProfile();
            } catch (error) {
                // Token might be expired, try refresh
                const refreshed = await refreshAccessToken();
                if (!refreshed) {
                    logout();
                    return false;
                }
            }
            
            return true;
        } else {
            logout();
            return false;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        logout();
        return false;
    }
}

/**
 * Logout user and clear all stored data
 * @returns {Promise<void>}
 */
export async function logout() {
    // Clear auth state
    authStore.set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null
    });
    
    // Clear localStorage
    if (browser) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
}

/**
 * Login with Google using your Django backend
 * @param {string} googleToken - Google ID token from OAuth
 * @param {string} referralCode - Optional referral code
 * @returns {Promise<object>}
 */
export async function loginWithGoogle(googleToken, referralCode = null) {
    try {
        const requestBody = {
            google_token: googleToken
        };
        
        if (referralCode) {
            requestBody.referral_code = referralCode;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/google-login/`, {
            method: 'POST',
            headers: {
                'X-API-Key': BOOK_SITE_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store tokens and update auth state
            authStore.set({
                isAuthenticated: true,
                user: data.user,
                accessToken: data.access_token,
                refreshToken: data.refresh_token
            });
            
            // Store in localStorage for persistence
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
}

/**
 * Helper function to get current auth state
 * @returns {object}
 */
export function getCurrentAuth() {
    let currentAuth;
    authStore.subscribe(auth => {
        currentAuth = auth;
    })();
    return currentAuth;
}

// Helper function for Svelte stores
function get(store) {
    let value;
    store.subscribe(v => value = v)();
    return value;
}
