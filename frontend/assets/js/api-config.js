// API Configuration for AlKahaf LMS
// This file contains all API endpoint configurations

const API_CONFIG = {
    // Local Development API Base URL
    BASE_URL: 'http://localhost:5000/api/v1',

    // Production API Base URL (uncomment for production)
    // BASE_URL: 'https://alkahafonlineacademy.com/api/v1',

    // Endpoints
    ENDPOINTS: {
        // Authentication
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
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