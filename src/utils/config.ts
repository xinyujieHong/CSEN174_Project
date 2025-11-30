/**
 * Application Configuration
 * 
 * Update these values based on your environment
 */

export const config = {
  // Backend API URL
  // For local development: 'http://localhost:3001/api'
  // For production: 'https://your-backend-url.com/api'
  apiUrl: 'http://localhost:3001/api',

  // Polling interval for real-time updates (in milliseconds)
  // Default: 2000 (2 seconds) - faster updates for better UX
  pollingInterval: 2000,

  // JWT token expiry warning threshold (in days)
  tokenExpiryWarning: 1,
};

/**
 * Usage:
 * 
 * To change the backend URL for production:
 * 1. Update config.apiUrl to your production backend URL
 * 2. Rebuild your app
 * 
 * OR set it dynamically in your index.html:
 * <script>
 *   window.CAMPUSPOOL_API_URL = 'https://your-backend.com/api';
 * </script>
 */
