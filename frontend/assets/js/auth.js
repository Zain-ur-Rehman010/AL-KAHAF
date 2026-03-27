// Authentication Handler for AlKahaf LMS
// Handles user registration, login, logout, and session management

(function() {
    'use strict';

    // Authentication Manager
    const AuthManager = {
        // Register new user
        register: async function(formData) {
            try {
                const response = await fetch(API_CONFIG.getURL(API_CONFIG.ENDPOINTS.REGISTER), {
                    method: 'POST',
                    headers: API_CONFIG.getHeaders(false),
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    return {
                        success: true,
                        message: data.message || 'Registration successful!',
                        email: data.data?.email
                    };
                } else {
                    return {
                        success: false,
                        message: data.message || 'Registration failed. Please try again.'
                    };
                }
            } catch (error) {
                console.error('Registration error:', error);
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.'
                };
            }
        },

        // Login user
        login: async function(email, password) {
            try {
                const response = await fetch(API_CONFIG.getURL(API_CONFIG.ENDPOINTS.LOGIN), {
                    method: 'POST',
                    headers: API_CONFIG.getHeaders(false),
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Save tokens
                    this.saveTokens(data.data.accessToken, data.data.refreshToken);

                    // Save user data
                    this.saveUser(data.data.user);

                    return {
                        success: true,
                        message: data.message || 'Login successful!',
                        user: data.data.user
                    };
                } else {
                    return {
                        success: false,
                        message: data.message || 'Invalid email or password.',
                        code: data.code,
                        email: data.data?.email,
                        otpSent: data.data?.otpSent
                    };
                }
            } catch (error) {
                console.error('Login error:', error);
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.'
                };
            }
        },

        // Resend verification OTP
        resendOtp: async function(email) {
            try {
                const response = await fetch(API_CONFIG.getURL(API_CONFIG.ENDPOINTS.RESEND_OTP), {
                    method: 'POST',
                    headers: API_CONFIG.getHeaders(false),
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    return { success: true, message: data.message || 'OTP resent. Please check your email.' };
                }

                return { success: false, message: data.message || 'Failed to resend OTP. Please try again.' };
            } catch (error) {
                console.error('Resend OTP error:', error);
                return { success: false, message: 'Network error. Please try again.' };
            }
        },

        // Verify OTP (email verification) and start session
        verifyOtp: async function(email, otp) {
            try {
                const response = await fetch(API_CONFIG.getURL(API_CONFIG.ENDPOINTS.VERIFY_OTP), {
                    method: 'POST',
                    headers: API_CONFIG.getHeaders(false),
                    body: JSON.stringify({ email, otp })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Save tokens returned by verify endpoint
                    this.saveTokens(data.data.accessToken, data.data.refreshToken);
                    this.saveUser(data.data.user);

                    return { success: true, message: data.message || 'Verified successfully!', user: data.data.user };
                }

                return { success: false, message: data.message || 'Invalid or expired OTP. Please try again.' };
            } catch (error) {
                console.error('Verify OTP error:', error);
                return { success: false, message: 'Network error. Please try again.' };
            }
        },

        // Logout user
        logout: async function() {
            try {
                const refreshToken = localStorage.getItem('refreshToken');

                await fetch(API_CONFIG.getURL(API_CONFIG.ENDPOINTS.LOGOUT), {
                    method: 'POST',
                    headers: API_CONFIG.getHeaders(true),
                    body: JSON.stringify({ refreshToken })
                });
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // Clear local storage regardless of API response
                this.clearSession();
                window.location.href = '/index.html';
            }
        },

        // Save authentication tokens
        saveTokens: function(accessToken, refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },

        // Save user data
        saveUser: function(user) {
            localStorage.setItem('user', JSON.stringify(user));
        },

        // Get current user
        getUser: function() {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        },

        // Check if user is authenticated
        isAuthenticated: function() {
            return !!localStorage.getItem('accessToken');
        },

        // Clear session data
        clearSession: function() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },

        // Redirect based on user role
        redirectToDashboard: function(user) {
            if (!user) {
                user = this.getUser();
            }

            if (!user) {
                window.location.href = '/auth/login';
                return;
            }

            // If a ?redirect= param is present, go there instead of dashboard
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect');
            if (redirect) {
                window.location.href = decodeURIComponent(redirect);
                return;
            }

            // Redirect based on role
            switch (user.role) {
                case 'admin':
                    window.location.href = '/admin/admin-dashboard';
                    break;
                case 'instructor':
                    window.location.href = '/instructor/instructor-dashboard';
                    break;
                case 'student':
                default:
                    window.location.href = '/student/student-dashboard';
                    break;
            }
        },

        // Show loading state
        showLoading: function(button) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
        },

        // Hide loading state
        hideLoading: function(button) {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Submit';
        },

        // Show alert message
        showAlert: function(message, type = 'success') {
            // Check if alert container exists
            let alertContainer = document.getElementById('alert-container');

            if (!alertContainer) {
                // Create alert container if it doesn't exist
                alertContainer = document.createElement('div');
                alertContainer.id = 'alert-container';
                alertContainer.className = 'position-fixed top-0 end-0 p-3';
                alertContainer.style.zIndex = '9999';
                document.body.appendChild(alertContainer);
            }

            // Create alert
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
            alertDiv.role = 'alert';
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;

            alertContainer.appendChild(alertDiv);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                alertDiv.classList.remove('show');
                setTimeout(() => alertDiv.remove(), 150);
            }, 5000);
        }
    };

    // Expose AuthManager globally
    window.AuthManager = AuthManager;

    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const firstName = document.getElementById('firstName')?.value;
            const lastName = document.getElementById('lastName')?.value;
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirmPassword')?.value;
            const role = document.getElementById('role')?.value || 'student';

            // Basic validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                AuthManager.showAlert('Please fill in all fields.', 'danger');
                return;
            }

            if (password !== confirmPassword) {
                AuthManager.showAlert('Passwords do not match.', 'danger');
                return;
            }

            if (password.length < 6) {
                AuthManager.showAlert('Password must be at least 6 characters long.', 'danger');
                return;
            }

            // Get submit button
            const submitButton = registerForm.querySelector('button[type="submit"]');
            AuthManager.showLoading(submitButton);

            // Send registration request
            const result = await AuthManager.register({
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                role
            });

            AuthManager.hideLoading(submitButton);

            if (result.success) {
                AuthManager.showAlert('Registration successful! Please check your email for the OTP.', 'success');

                setTimeout(() => {
                    window.location.href = '/auth/otp?email=' + encodeURIComponent(email);
                }, 1500);
            } else {
                AuthManager.showAlert(result.message, 'danger');
            }
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Auto-fill email if user just registered
        const registeredEmail = localStorage.getItem('registeredEmail');
        if (registeredEmail) {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = registeredEmail;
                // Clear the stored email
                localStorage.removeItem('registeredEmail');
                // Focus on password field for convenience
                const passwordInput = document.getElementById('password');
                if (passwordInput) {
                    passwordInput.focus();
                }
            }
        }

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            // Basic validation
            if (!email || !password) {
                AuthManager.showAlert('Please enter both email and password.', 'danger');
                return;
            }

            // Get submit button
            const submitButton = loginForm.querySelector('button[type="submit"]');
            AuthManager.showLoading(submitButton);

            // Send login request
            const result = await AuthManager.login(email, password);

            AuthManager.hideLoading(submitButton);

            if (result.success) {
                AuthManager.showAlert(result.message, 'success');

                // Redirect after 1.5 seconds
                setTimeout(() => {
                    AuthManager.redirectToDashboard(result.user);
                }, 1500);
            } else {
                // If backend says email isn't verified, show OTP verification UI on login page
                if (result.code === 'EMAIL_NOT_VERIFIED') {
                    const otpBox = document.getElementById('otp-verify-box');
                    if (otpBox) otpBox.classList.remove('d-none');

                    if (result.otpSent === false) {
                        AuthManager.showAlert('We could not send OTP email. Please click "Resend OTP" or try again later.', 'danger');
                    } else {
                        AuthManager.showAlert('OTP sent to your email. Please enter it below.', 'info');
                    }
                } else {
                    AuthManager.showAlert(result.message, 'danger');
                }
            }
        });
    }

    // OTP verification UI wiring (on login page)
    const otpVerifyBox = document.getElementById('otp-verify-box');
    if (otpVerifyBox) {
        const resendBtn = document.getElementById('otp-resend-btn');
        const verifyBtn = document.getElementById('otp-verify-btn');

        if (resendBtn) {
            resendBtn.addEventListener('click', async function() {
                const email = document.getElementById('email')?.value;
                if (!email) {
                    AuthManager.showAlert('Please enter your email first.', 'danger');
                    return;
                }

                AuthManager.showLoading(resendBtn);
                const result = await AuthManager.resendOtp(email);
                AuthManager.hideLoading(resendBtn);

                AuthManager.showAlert(result.message, result.success ? 'success' : 'danger');
            });
        }

        if (verifyBtn) {
            verifyBtn.addEventListener('click', async function() {
                const email = document.getElementById('email')?.value;
                const otp = document.getElementById('otp')?.value?.trim();

                if (!email) {
                    AuthManager.showAlert('Please enter your email first.', 'danger');
                    return;
                }
                if (!otp || otp.length < 6) {
                    AuthManager.showAlert('Please enter the 6-digit OTP.', 'danger');
                    return;
                }

                AuthManager.showLoading(verifyBtn);
                const result = await AuthManager.verifyOtp(email, otp);
                AuthManager.hideLoading(verifyBtn);

                if (result.success) {
                    AuthManager.showAlert(result.message, 'success');
                    setTimeout(() => {
                        AuthManager.redirectToDashboard(result.user);
                    }, 800);
                } else {
                    AuthManager.showAlert(result.message, 'danger');
                }
            });
        }
    }

    // Handle logout
    const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            await AuthManager.logout();
        });
    });

    // Check authentication on protected pages
    const isProtectedPage = document.body.hasAttribute('data-protected');
    if (isProtectedPage && !AuthManager.isAuthenticated()) {
        window.location.href = '/src/pages/auth/login.html';
    }

    // Display user info if logged in
    const userInfoElements = document.querySelectorAll('[data-user-info]');
    if (userInfoElements.length > 0 && AuthManager.isAuthenticated()) {
        const user = AuthManager.getUser();
        if (user) {
            userInfoElements.forEach(element => {
                const infoType = element.dataset.userInfo;
                switch (infoType) {
                    case 'name':
                        element.textContent = `${user.firstName} ${user.lastName}`;
                        break;
                    case 'email':
                        element.textContent = user.email;
                        break;
                    case 'role':
                        element.textContent = user.role;
                        break;
                }
            });
        }
    }

})();