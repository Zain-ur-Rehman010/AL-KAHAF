// Authentication Module

const apiService = require('./api-service');
const { API_ENDPOINTS } = require('../config');

class AuthModule {
  async register(userData) {
    return apiService.post(API_ENDPOINTS.REGISTER, userData);
  }

  async login(email, password) {
    const response = await apiService.post(API_ENDPOINTS.LOGIN, {
      email,
      password
    });

    if (response.data && response.data.token) {
      apiService.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    await apiService.post(API_ENDPOINTS.LOGOUT, {});
    apiService.clearToken();
  }

  async forgotPassword(email) {
    return apiService.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token, newPassword) {
    return apiService.post(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword
    });
  }

  isLoggedIn() {
    return !!apiService.getToken();
  }

  getToken() {
    return apiService.getToken();
  }
}

module.exports = new AuthModule();
