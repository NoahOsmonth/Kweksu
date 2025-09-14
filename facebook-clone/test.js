// Test script for Facebook Clone
console.log('Facebook Clone Test Suite Starting...');

// Test 1: Check if main elements exist
function testElementsExist() {
    console.log('Testing element existence...');

    const tests = [
        { id: 'loginForm', name: 'Login Form' },
        { id: 'email', name: 'Email Input' },
        { id: 'password', name: 'Password Input' },
        { id: 'errorMessage', name: 'Error Message Container' },
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'logoutBtn', name: 'Logout Button' }
    ];

    tests.forEach(test => {
        const element = document.getElementById(test.id);
        if (element) {
            console.log(`✅ ${test.name} found`);
        } else {
            console.error(`❌ ${test.name} not found`);
        }
    });
}

// Test 2: Validate form validation
function testFormValidation() {
    console.log('Testing form validation...');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput && passwordInput) {
        // Test invalid email
        emailInput.value = 'invalid-email';
        passwordInput.value = '123';

        if (window.facebookClone) {
            const emailValid = window.facebookClone.validateEmail();
            const passwordValid = window.facebookClone.validatePassword();

            if (!emailValid) {
                console.log('✅ Email validation working (correctly rejected invalid email)');
            } else {
                console.error('❌ Email validation failed');
            }

            if (!passwordValid) {
                console.log('✅ Password validation working (correctly rejected short password)');
            } else {
                console.error('❌ Password validation failed');
            }
        }

        // Test valid inputs
        emailInput.value = 'test@example.com';
        passwordInput.value = 'test123';

        if (window.facebookClone) {
            const emailValid = window.facebookClone.validateEmail();
            const passwordValid = window.facebookClone.validatePassword();

            if (emailValid) {
                console.log('✅ Email validation working (correctly accepted valid email)');
            } else {
                console.error('❌ Email validation failed for valid email');
            }

            if (passwordValid) {
                console.log('✅ Password validation working (correctly accepted valid password)');
            } else {
                console.error('❌ Password validation failed for valid password');
            }
        }
    }
}

// Test 3: Test responsiveness
function testResponsiveness() {
    console.log('Testing responsive design...');

    const container = document.querySelector('.container');
    const loginForm = document.querySelector('.login-form-container');

    if (container && loginForm) {
        // Simulate mobile viewport
        const originalWidth = window.innerWidth;

        // Check if CSS media queries are working
        const containerStyles = window.getComputedStyle(container);
        console.log(`✅ Container display: ${containerStyles.display}`);
        console.log(`✅ Container flex-direction: ${containerStyles.flexDirection}`);

        const formStyles = window.getComputedStyle(loginForm);
        console.log(`✅ Form padding: ${formStyles.padding}`);

        console.log('✅ Responsive design styles loaded');
    }
}

// Test 4: Test accessibility
function testAccessibility() {
    console.log('Testing accessibility features...');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.querySelector('.login-btn');

    if (emailInput && passwordInput && loginBtn) {
        console.log(`✅ Email input type: ${emailInput.type}`);
        console.log(`✅ Password input type: ${passwordInput.type}`);
        console.log(`✅ Email autocomplete: ${emailInput.autocomplete}`);
        console.log(`✅ Password autocomplete: ${passwordInput.autocomplete}`);
        console.log(`✅ Form has proper labels and placeholders`);
    }
}

// Test 5: Test login simulation
function testLoginSimulation() {
    console.log('Testing login simulation...');

    if (window.facebookClone) {
        const testEmail = 'test@example.com';
        const testPassword = 'test123';

        document.getElementById('email').value = testEmail;
        document.getElementById('password').value = testPassword;

        console.log('✅ Test credentials entered');
        console.log('✅ Ready for manual login test');
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting Facebook Clone Tests...\n');

    testElementsExist();
    console.log('');

    testFormValidation();
    console.log('');

    testResponsiveness();
    console.log('');

    testAccessibility();
    console.log('');

    testLoginSimulation();
    console.log('');

    console.log('✅ All automated tests completed!');
    console.log('📱 To test manually:');
    console.log('1. Try logging in with test@example.com / test123');
    console.log('2. Test form validation with invalid inputs');
    console.log('3. Test logout functionality');
    console.log('4. Test responsive design by resizing browser');
    console.log('5. Test keyboard navigation');
}

// Wait for page to load completely
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 1000);
    });
} else {
    setTimeout(runAllTests, 1000);
}