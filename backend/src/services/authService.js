// Auth Service

class AuthService {
  async register(userData) {
    // TODO: Hash password
    // TODO: Check if user exists
    // TODO: Save to database
    // TODO: Generate JWT token
    return { user: {}, token: '' };
  }

  async login(email, password) {
    // TODO: Find user by email
    // TODO: Verify password
    // TODO: Generate JWT token
    return { user: {}, token: '' };
  }

  async refreshToken(refreshToken) {
    // TODO: Verify refresh token
    // TODO: Generate new access token
    return '';
  }

  async sendPasswordResetEmail(email) {
    // TODO: Find user by email
    // TODO: Generate reset token
    // TODO: Send email with reset link
  }

  async resetPassword(token, newPassword) {
    // TODO: Verify token
    // TODO: Hash new password
    // TODO: Update in database
  }
}

module.exports = new AuthService();
