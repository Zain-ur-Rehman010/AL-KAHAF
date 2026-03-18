// API Configuration for AlKahaf LMS
// This file contains all API endpoint configurations

const isLocalhost = typeof window !== 'undefined'
    && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_CONFIG = {
    // Auto-switch API URL for local development vs production.
    BASE_URL: isLocalhost
        ? 'http://localhost:5000/api/v1'
        : 'https://alkahafonlineacademy.com/api/v1',

    // Endpoints
    ENDPOINTS: {
        // Authentication
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh-token',
        ME: '/auth/me',

        // Courses
        COURSES: '/courses',
        COURSE_BY_ID: (id) => `/courses/${id}`,

        // Enrollments
        ENROLLMENTS: '/enrollments',
        ENROLLMENT_BY_ID: (id) => `/enrollments/${id}`,
        ENROLLMENT_PROGRESS: (id) => `/enrollments/${id}/progress`,

        // Users
        PROFILE: '/users/profile',
        STATS: '/users/stats'
    },

    // Helper function to get full URL
    getURL: function(endpoint) {
        return this.BASE_URL + endpoint;
    },

    // Helper function to get headers with authentication
    getHeaders: function(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}