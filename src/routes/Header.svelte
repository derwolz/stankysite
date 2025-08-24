<!-- src/routes/Header.svelte -->
<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { writable } from 'svelte/store';
    import { PUBLIC_API_BASE_URL, PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
    
    // Authentication store
    export const authStore = writable({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null
    });
    
    let component;
    let isAuthenticated = false;
    let user = null;
    let googleLoaded = false;
    
    // Your API configuration from environment variables
    const API_BASE_URL = PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const GOOGLE_CLIENT_ID = PUBLIC_GOOGLE_CLIENT_ID;
    
    let BOOK_SITE_API_KEY = null;
    
    // Subscribe to auth store
    authStore.subscribe(auth => {
        isAuthenticated = auth.isAuthenticated;
        user = auth.user;
    });
    
    function handleScroll(event) {
        const currentDelta = event.deltaY;
        if (currentDelta >= 0) {
            if (!component.classList.contains("hide")) {
                component.classList.add("hide");
            }
        } else {
            component.classList.remove("hide");
        }
    }
    
    async function handleGoogleLogin(response) {
        try {
            console.log('Google login response:', response);
            
            if (!BOOK_SITE_API_KEY) {
                throw new Error('API key not loaded yet');
            }
            
            // Get referral code from URL if present
            const urlParams = new URLSearchParams(window.location.search);
            const referralCode = urlParams.get('ref');
            
            const requestBody = {
                google_token: response.credential
            };
            
            // Add referral code if present
            if (referralCode) {
                requestBody.referral_code = referralCode;
            }
            
            const apiResponse = await fetch(`${API_BASE_URL}/api/auth/google-login/`, {
                method: 'POST',
                headers: {
                    'X-API-Key': BOOK_SITE_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await apiResponse.json();
            
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
                
                console.log('Login successful:', data);
                
                // Optionally redirect or show success message
                if (data.user.is_new_user) {
                    console.log('Welcome new user!');
                }
            } else {
                console.error('Login failed:', data);
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login error. Please check your connection and try again.');
        }
    }
    
    async function handleLogout() {
        try {
            // Clear auth state
            authStore.set({
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null
            });
            
            // Clear localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            
            // Optionally call logout endpoint on your backend
            // await fetch(`${API_BASE_URL}/api/auth/logout/`, {
            //     method: 'POST',
            //     headers: {
            //         'X-API-Key': BOOK_SITE_API_KEY,
            //         'Authorization': `Bearer ${accessToken}`
            //     }
            // });
            
            // Reload page to reset state
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    function initializeGoogleSignIn() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin
            });
            googleLoaded = true;
        }
    }
    
    function triggerGoogleLogin() {
        if (googleLoaded && google.accounts) {
            google.accounts.id.prompt();
        } else {
            console.error('Google Sign-In not loaded yet');
        }
    }
    
    onMount(() => {
        window.addEventListener('wheel', handleScroll, { passive: true });
        
        // Get API key from server
        getApiKey();
        
        // Load Google Sign-In script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.head.appendChild(script);
        
        // Check if user is already authenticated from localStorage
        checkAuthStatus();
        
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    });
    
    async function getApiKey() {
        try {
            const response = await fetch('/api/config');
            if (response.ok) {
                const config = await response.json();
                BOOK_SITE_API_KEY = config.apiKey;
            }
        } catch (error) {
            console.error('Failed to get API key:', error);
        }
    }
    
    function checkAuthStatus() {
        if (!browser) return;
        
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
            }
        } catch (error) {
            console.error('Auth check error:', error);
            // Clear invalid data
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    }
</script>

<header> 
    <nav bind:this={component} class="fixed z-[999] mx-8 flex w-screen justify-between ">
        <ul>
            <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
                <a href="/">Home</a>
            </li>
        </ul>
        
        <ul class="flex items-center gap-4">
            <li class="text-xl min-w-12">
                <a href="https://patreon.com/KingStanky" rel="noopener noreferrer" target="_blank">
                    <img src="images/PATREON.svg" width="25px" alt="Patreon"/>
                </a>
            </li>

            <li class="text-xl min-w-24">
                <a href="https://x.com/TheKingOfStank" rel="noopener noreferrer" target="_blank">
                    <span class="text-2xl">𝕏</span>
                </a>
            </li>
            
            <!-- Authentication Section -->
            <li class="auth-section">
                {#if isAuthenticated}
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col items-end">
                            <span class="text-sm font-medium">
                                {user?.first_name || user?.username}
                            </span>
                            {#if user?.credits !== undefined}
                                <span class="text-xs text-gray-400">
                                    {user.credits} credits
                                </span>
                            {/if}
                        </div>
                        <button 
                            on:click={handleLogout}
                            class="text-sm px-3 py-1 border border-current rounded hover:bg-white hover:text-black transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                {:else}
                    <button 
                        on:click={triggerGoogleLogin}
                        class="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors font-medium"
                    >
                        <!-- Google Icon -->
                        <svg class="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span class="hidden sm:inline">Sign in with Google</span>
                        <span class="sm:hidden">Login</span>
                    </button>
                {/if}
            </li>
        </ul>
    </nav>
</header>

<style>
header {
    display: flex;
    justify-content: space-between;
	transition: all 0.5s ease-in-out;
}

.hide-nav {
	opacity: 0;
    display: none;
}

.corner {
    width: 3em;
    height: 3em;
}

.corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
}

nav {
    font-family: var(--font-tech);
}

svg {
    width: 2em;
    height: 3em;
    display: block;
}

path {
    fill: var(--background);
}

ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
}

li {
    position: relative;
    height: 100%;
}

nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
}

a:hover {
    color: var(--color-theme-1);
}

.auth-section {
    display: flex;
    align-items: center;
    height: 100%;
}

.auth-section button {
    font-family: inherit;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
}
</style>
