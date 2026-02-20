import client from './client';

const authAPI = {
    /**
     * Register a new user
     * @param {Object} userData - { username, email, password }
     * @returns {Promise} Response with user data
     */
    signup: (userData) => {
        return client.post('/auth/signup', userData);
    },

    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise} Response with user data
     */
    login: (credentials) => {
        return client.post('/auth/login', credentials);
    },

    /**
     * Get user profile
     * @param {String} userId - User ID
     * @returns {Promise} Response with user profile
     */
    getProfile: (userId) => {
        return client.get(`/auth/profile/${userId}`);
    },

    /**
     * Check if email exists
     * @param {String} email - Email to check
     * @returns {Promise} Response with exists boolean
     */
    checkEmail: (email) => {
        return client.get(`/auth/check-email/${email}`);
    },

    /**
     * Check if username exists
     * @param {String} username - Username to check
     * @returns {Promise} Response with exists boolean
     */
    checkUsername: (username) => {
        return client.get(`/auth/check-username/${username}`);
    }
};

export default authAPI;
