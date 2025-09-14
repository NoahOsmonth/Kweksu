// SecurePay Payment Processing System
class SecurePayment {
    constructor() {
        this.cardTypes = {
            visa: {
                pattern: /^4/,
                length: [13, 16, 19],
                cvvLength: 3,
                icon: '💳',
                name: 'Visa',
                color: '#1a1f71'
            },
            mastercard: {
                pattern: /^5[1-5]|^2[2-7]/,
                length: [16],
                cvvLength: 3,
                icon: '💳',
                name: 'Mastercard',
                color: '#eb001b'
            },
            amex: {
                pattern: /^3[47]/,
                length: [15],
                cvvLength: 4,
                icon: '💳',
                name: 'American Express',
                color: '#006fcf'
            },
            discover: {
                pattern: /^6(?:011|5)/,
                length: [16],
                cvvLength: 3,
                icon: '💳',
                name: 'Discover',
                color: '#ff6000'
            },
            jcb: {
                pattern: /^35/,
                length: [16],
                cvvLength: 3,
                icon: '💳',
                name: 'JCB',
                color: '#0066cc'
            },
            dinersclub: {
                pattern: /^3[068]/,
                length: [14],
                cvvLength: 3,
                icon: '💳',
                name: 'Diners Club',
                color: '#0079be'
            }
        };

        this.currentCardType = null;
        this.isProcessing = false;
        this.formData = {};

        this.init();
    }

    init() {
        this.bindEvents();
        this.addInputFormatting();
        this.setupValidation();
        this.setupModals();
        this.addLoadingAnimations();

        // Show demo hint after page loads
        setTimeout(() => {
            this.showDemoHint();
        }, 2000);
    }

    bindEvents() {
        // Form submission
        const form = document.getElementById('paymentForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handlePayment(e));
        }

        // Card number input events
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => this.handleCardNumberInput(e));
            cardNumberInput.addEventListener('blur', () => this.validateCardNumber());
        }

        // Cardholder name events
        const cardholderNameInput = document.getElementById('cardholderName');
        if (cardholderNameInput) {
            cardholderNameInput.addEventListener('input', (e) => this.handleNameInput(e));
            cardholderNameInput.addEventListener('blur', () => this.validateCardholderName());
        }

        // Expiry date events
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', (e) => this.handleExpiryInput(e));
            expiryDateInput.addEventListener('blur', () => this.validateExpiryDate());
        }

        // CVV events
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => this.handleCvvInput(e));
            cvvInput.addEventListener('blur', () => this.validateCvv());
        }

        // Email events
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail());
        }

        // Address validation events
        ['address', 'city', 'state', 'zipCode'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('blur', () => this.validateField(field));
            }
        });

        // CVV help modal
        const cvvHelp = document.getElementById('cvvHelp');
        if (cvvHelp) {
            cvvHelp.addEventListener('click', () => this.showCvvHelp());
        }

        // Modal events
        this.bindModalEvents();
    }

    bindModalEvents() {
        // Success modal events
        const downloadReceipt = document.getElementById('downloadReceipt');
        if (downloadReceipt) {
            downloadReceipt.addEventListener('click', () => this.downloadReceipt());
        }

        const newPayment = document.getElementById('newPayment');
        if (newPayment) {
            newPayment.addEventListener('click', () => this.startNewPayment());
        }

        // Error modal events
        const retryPayment = document.getElementById('retryPayment');
        if (retryPayment) {
            retryPayment.addEventListener('click', () => this.hideModal('errorModal'));
        }

        const contactSupport = document.getElementById('contactSupport');
        if (contactSupport) {
            contactSupport.addEventListener('click', () => this.contactSupport());
        }

        // CVV modal events
        const closeCvvModal = document.getElementById('closeCvvModal');
        if (closeCvvModal) {
            closeCvvModal.addEventListener('click', () => this.hideModal('cvvModal'));
        }

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    addInputFormatting() {
        // Real-time formatting as user types
        const inputs = {
            cardNumber: this.formatCardNumber.bind(this),
            expiryDate: this.formatExpiryDate.bind(this),
            cvv: this.formatCvv.bind(this),
            zipCode: this.formatZipCode.bind(this)
        };

        Object.keys(inputs).forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', inputs[inputId]);
            }
        });
    }

    handleCardNumberInput(e) {
        const value = e.target.value.replace(/\s/g, '');
        const cardType = this.detectCardType(value);

        if (cardType !== this.currentCardType) {
            this.currentCardType = cardType;
            this.updateCardTypeIndicator(cardType);
            this.updateCvvField(cardType);
        }

        this.formatCardNumber(e);
        this.validateCardNumber();
    }

    detectCardType(number) {
        for (const [type, config] of Object.entries(this.cardTypes)) {
            if (config.pattern.test(number)) {
                return type;
            }
        }
        return null;
    }

    updateCardTypeIndicator(cardType) {
        const indicator = document.getElementById('cardTypeIcon');
        if (!indicator) return;

        if (cardType && this.cardTypes[cardType]) {
            const config = this.cardTypes[cardType];
            indicator.textContent = config.icon;
            indicator.style.color = config.color;
            indicator.classList.add('active');
            indicator.title = config.name;
        } else {
            indicator.textContent = '💳';
            indicator.style.color = '';
            indicator.classList.remove('active');
            indicator.title = '';
        }
    }

    updateCvvField(cardType) {
        const cvvInput = document.getElementById('cvv');
        const cvvLabel = document.querySelector('label[for="cvv"]');

        if (cardType === 'amex') {
            cvvInput.placeholder = '1234';
            cvvInput.maxLength = '4';
            if (cvvLabel) {
                cvvLabel.innerHTML = cvvLabel.innerHTML.replace('CVV', 'CID');
            }
        } else {
            cvvInput.placeholder = '123';
            cvvInput.maxLength = '3';
            if (cvvLabel) {
                cvvLabel.innerHTML = cvvLabel.innerHTML.replace('CID', 'CVV');
            }
        }
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = '';

        // Add spaces every 4 digits
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }

        e.target.value = value;
    }

    formatCvv(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    }

    formatZipCode(e) {
        e.target.value = e.target.value.replace(/[^0-9-]/g, '');
    }

    handleNameInput(e) {
        // Allow only letters, spaces, and common name characters
        e.target.value = e.target.value.replace(/[^a-zA-Z\s\-\.\']/g, '');
    }

    handleExpiryInput(e) {
        this.formatExpiryDate(e);
        this.validateExpiryDate();
    }

    handleCvvInput(e) {
        this.formatCvv(e);
        const maxLength = this.currentCardType === 'amex' ? 4 : 3;
        if (e.target.value.length > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
        }
        this.validateCvv();
    }

    // Validation Methods
    validateCardNumber() {
        const input = document.getElementById('cardNumber');
        const value = input.value.replace(/\s/g, '');
        const errorElement = document.getElementById('cardNumberError');

        if (!value) {
            this.setFieldError('cardNumber', 'Card number is required');
            return false;
        }

        if (!this.currentCardType) {
            this.setFieldError('cardNumber', 'Invalid card number');
            return false;
        }

        const cardConfig = this.cardTypes[this.currentCardType];
        if (!cardConfig.length.includes(value.length)) {
            this.setFieldError('cardNumber', `Invalid ${cardConfig.name} card number`);
            return false;
        }

        if (!this.luhnCheck(value)) {
            this.setFieldError('cardNumber', 'Invalid card number');
            return false;
        }

        this.setFieldSuccess('cardNumber');
        return true;
    }

    validateCardholderName() {
        const input = document.getElementById('cardholderName');
        const value = input.value.trim();

        if (!value) {
            this.setFieldError('cardholderName', 'Cardholder name is required');
            return false;
        }

        if (value.length < 2) {
            this.setFieldError('cardholderName', 'Please enter a valid name');
            return false;
        }

        this.setFieldSuccess('cardholderName');
        return true;
    }

    validateExpiryDate() {
        const input = document.getElementById('expiryDate');
        const value = input.value;

        if (!value || value.length !== 5) {
            this.setFieldError('expiryDate', 'Please enter MM/YY format');
            return false;
        }

        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expMonth < 1 || expMonth > 12) {
            this.setFieldError('expiryDate', 'Invalid month');
            return false;
        }

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            this.setFieldError('expiryDate', 'Card has expired');
            return false;
        }

        this.setFieldSuccess('expiryDate');
        return true;
    }

    validateCvv() {
        const input = document.getElementById('cvv');
        const value = input.value;
        const expectedLength = this.currentCardType === 'amex' ? 4 : 3;

        if (!value) {
            this.setFieldError('cvv', 'CVV is required');
            return false;
        }

        if (value.length !== expectedLength) {
            this.setFieldError('cvv', `CVV must be ${expectedLength} digits`);
            return false;
        }

        this.setFieldSuccess('cvv');
        return true;
    }

    validateEmail() {
        const input = document.getElementById('email');
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            this.setFieldError('email', 'Email is required');
            return false;
        }

        if (!emailRegex.test(value)) {
            this.setFieldError('email', 'Please enter a valid email');
            return false;
        }

        this.setFieldSuccess('email');
        return true;
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const value = input.value.trim();

        if (!value) {
            this.setFieldError(fieldName, `${this.getFieldLabel(fieldName)} is required`);
            return false;
        }

        // Specific validation for ZIP code
        if (fieldName === 'zipCode') {
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(value)) {
                this.setFieldError(fieldName, 'Please enter a valid ZIP code');
                return false;
            }
        }

        this.setFieldSuccess(fieldName);
        return true;
    }

    getFieldLabel(fieldName) {
        const labels = {
            address: 'Street address',
            city: 'City',
            state: 'State',
            zipCode: 'ZIP code'
        };
        return labels[fieldName] || fieldName;
    }

    setFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        if (input) {
            input.classList.remove('success');
            input.classList.add('error');
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    setFieldSuccess(fieldName) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        if (input) {
            input.classList.remove('error');
            input.classList.add('success');
        }

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    luhnCheck(number) {
        let sum = 0;
        let isEven = false;

        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    // Payment Processing
    async handlePayment(e) {
        e.preventDefault();

        if (this.isProcessing) return;

        // Validate all fields
        const isValid = this.validateAllFields();
        if (!isValid) {
            this.showFormError('Please correct the errors above');
            return;
        }

        // Collect form data
        this.collectFormData();

        // Start processing
        this.startProcessing();

        try {
            // Simulate payment processing
            const result = await this.processPayment();

            if (result.success) {
                this.handlePaymentSuccess(result);
            } else {
                this.handlePaymentError(result.error);
            }
        } catch (error) {
            this.handlePaymentError('An unexpected error occurred. Please try again.');
        } finally {
            this.stopProcessing();
        }
    }

    validateAllFields() {
        const validations = [
            this.validateCardNumber(),
            this.validateCardholderName(),
            this.validateExpiryDate(),
            this.validateCvv(),
            this.validateEmail(),
            this.validateField('address'),
            this.validateField('city'),
            this.validateField('state'),
            this.validateField('zipCode')
        ];

        return validations.every(result => result === true);
    }

    collectFormData() {
        this.formData = {
            cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
            cardholderName: document.getElementById('cardholderName').value.trim(),
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value,
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            zipCode: document.getElementById('zipCode').value.trim(),
            saveCard: document.getElementById('saveCard').checked,
            newsletter: document.getElementById('newsletter').checked,
            cardType: this.currentCardType,
            amount: 31.49
        };
    }

    async processPayment() {
        try {
            // Send payment data to server for storage
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Server error');
            }

            if (result.success) {
                return {
                    success: true,
                    transactionId: result.transactionId,
                    timestamp: new Date(),
                    maskedCardNumber: result.maskedCardNumber
                };
            } else {
                return {
                    success: false,
                    error: result.message || 'Payment declined'
                };
            }
        } catch (error) {
            console.error('Payment processing error:', error);

            // Fallback to client-side simulation if server is unavailable
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Demo success rate: 85%
                    const shouldSucceed = Math.random() > 0.15;

                    if (shouldSucceed) {
                        resolve({
                            success: true,
                            transactionId: this.generateTransactionId(),
                            timestamp: new Date(),
                            maskedCardNumber: this.maskCardNumber(this.formData.cardNumber),
                            offline: true
                        });
                    } else {
                        const errors = [
                            'Insufficient funds',
                            'Card declined by issuer',
                            'Invalid card information',
                            'Transaction limit exceeded',
                            'Suspected fraud - please contact your bank'
                        ];

                        resolve({
                            success: false,
                            error: errors[Math.floor(Math.random() * errors.length)]
                        });
                    }
                }, 2000 + Math.random() * 1000); // 2-3 second delay
            });
        }
    }

    generateTransactionId() {
        const prefix = 'TXN';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }

    maskCardNumber(cardNumber) {
        const last4 = cardNumber.slice(-4);
        return `•••• •••• •••• ${last4}`;
    }

    startProcessing() {
        this.isProcessing = true;
        const button = document.getElementById('payButton');

        if (button) {
            button.disabled = true;
            button.classList.add('loading');
        }

        this.hideFormError();
    }

    stopProcessing() {
        this.isProcessing = false;
        const button = document.getElementById('payButton');

        if (button) {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    handlePaymentSuccess(result) {
        // Update success modal with transaction details
        document.getElementById('transactionId').textContent = result.transactionId;
        document.getElementById('transactionDate').textContent = result.timestamp.toLocaleString();
        document.getElementById('maskedCard').textContent = result.maskedCardNumber;

        // Show additional info if data was stored in database
        if (!result.offline) {
            console.log('✅ Payment data stored in database:', result.transactionId);
        } else {
            console.log('⚠️ Offline mode - payment data not stored');
        }

        // Show success modal
        this.showModal('successModal');

        // Log success for demo
        console.log('Payment Success:', result);
    }

    handlePaymentError(errorMessage) {
        document.getElementById('errorMessage').textContent = errorMessage;
        this.showModal('errorModal');

        // Log error for demo
        console.log('Payment Error:', errorMessage);
    }

    showFormError(message) {
        const errorElement = document.getElementById('formError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    hideFormError() {
        const errorElement = document.getElementById('formError');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }

    // Modal Management
    setupModals() {
        // Initialize modal state
        this.hideAllModals();
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            // Focus management for accessibility
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    hideAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }

    showCvvHelp() {
        this.showModal('cvvModal');
    }

    // Modal Actions
    downloadReceipt() {
        // Generate and download a demo receipt
        const receiptData = this.generateReceiptData();
        this.downloadFile('payment-receipt.txt', receiptData);

        // Show success message
        setTimeout(() => {
            alert('Receipt downloaded successfully!');
        }, 500);
    }

    generateReceiptData() {
        const now = new Date();
        return `
SECUREPAY PAYMENT RECEIPT
========================

Transaction ID: ${document.getElementById('transactionId').textContent}
Date: ${now.toLocaleString()}
Amount: $31.49

PAYMENT METHOD
Card: ${document.getElementById('maskedCard').textContent}
Type: ${this.currentCardType ? this.cardTypes[this.currentCardType].name : 'Unknown'}

BILLING INFORMATION
Name: ${this.formData.cardholderName}
Email: ${this.formData.email}
Address: ${this.formData.address}
City: ${this.formData.city}, ${this.formData.state} ${this.formData.zipCode}

TRANSACTION DETAILS
Description: Premium Service Plan
Subtotal: $29.99
Processing Fee: $1.50
Total: $31.49

Thank you for your payment!
This is a demo transaction - no actual charges were made.

SecurePay Demo System
${now.getFullYear()}
        `.trim();
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    startNewPayment() {
        // Reset form and close modal
        this.resetForm();
        this.hideModal('successModal');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    resetForm() {
        const form = document.getElementById('paymentForm');
        if (form) {
            form.reset();
        }

        // Clear validation states
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });

        // Clear error messages
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });

        // Reset card type
        this.currentCardType = null;
        this.updateCardTypeIndicator(null);

        // Reset CVV field
        const cvvInput = document.getElementById('cvv');
        const cvvLabel = document.querySelector('label[for="cvv"]');
        if (cvvInput && cvvLabel) {
            cvvInput.placeholder = '123';
            cvvInput.maxLength = '3';
            cvvLabel.innerHTML = cvvLabel.innerHTML.replace('CID', 'CVV');
        }

        this.hideFormError();
    }

    contactSupport() {
        alert('Demo Support: In a real application, this would open a support chat or contact form. For this demo, please try the payment again or use different card details.');
        this.hideModal('errorModal');
    }

    // Demo and Helper Functions
    showDemoHint() {
        const hintElement = document.createElement('div');
        hintElement.className = 'demo-hint';
        hintElement.innerHTML = `
            <div class="hint-content">
                <h4>💡 Demo Mode</h4>
                <p>This is a payment demo. Use any valid card format:</p>
                <ul>
                    <li><strong>Visa:</strong> 4111 1111 1111 1111</li>
                    <li><strong>Mastercard:</strong> 5555 5555 5555 4444</li>
                    <li><strong>Amex:</strong> 3782 8224 6310 005</li>
                    <li><strong>Any future date for expiry</strong></li>
                    <li><strong>Any 3-4 digit CVV</strong></li>
                </ul>
                <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
            </div>
        `;

        // Add hint styles
        const hintStyles = `
            .demo-hint {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                max-width: 350px;
                z-index: 10000;
                animation: slideInRight 0.5s ease-out;
            }
            
            .hint-content h4 {
                margin: 0 0 10px 0;
                font-size: 16px;
            }
            
            .hint-content p {
                margin: 0 0 10px 0;
                font-size: 14px;
            }
            
            .hint-content ul {
                margin: 10px 0;
                padding-left: 20px;
                font-size: 12px;
            }
            
            .hint-content li {
                margin-bottom: 5px;
            }
            
            .hint-content button {
                background: white;
                color: var(--primary-color);
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 10px;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;

        // Add styles if not already added
        if (!document.getElementById('demo-hint-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'demo-hint-styles';
            styleElement.textContent = hintStyles;
            document.head.appendChild(styleElement);
        }

        document.body.appendChild(hintElement);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (hintElement.parentElement) {
                hintElement.remove();
            }
        }, 15000);
    }

    addLoadingAnimations() {
        // Add entrance animations to elements
        const elements = document.querySelectorAll('.order-summary, .payment-form-container, .trust-section');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.6s ease-out';

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function generateRandomData() {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const emails = ['john@example.com', 'jane@example.com', 'mike@example.com', 'sarah@example.com', 'david@example.com'];
    const addresses = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm St', '654 Maple Dr'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
    const zips = ['10001', '90210', '60601', '77001', '85001'];

    return {
        name: names[Math.floor(Math.random() * names.length)],
        email: emails[Math.floor(Math.random() * emails.length)],
        address: addresses[Math.floor(Math.random() * addresses.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zip: zips[Math.floor(Math.random() * zips.length)]
    };
}

// Auto-fill demo data function (for testing)
function fillDemoData() {
    const data = generateRandomData();

    document.getElementById('cardNumber').value = '4111 1111 1111 1111';
    document.getElementById('cardholderName').value = data.name;
    document.getElementById('expiryDate').value = '12/25';
    document.getElementById('cvv').value = '123';
    document.getElementById('email').value = data.email;
    document.getElementById('address').value = data.address;
    document.getElementById('city').value = data.city;
    document.getElementById('state').value = data.state;
    document.getElementById('zipCode').value = data.zip;

    // Trigger events to update validation
    document.getElementById('cardNumber').dispatchEvent(new Event('input'));
    document.getElementById('cardNumber').dispatchEvent(new Event('blur'));
}

// Console helper for demo
console.log('🎯 SecurePay Demo Loaded!');
console.log('💡 Try: fillDemoData() to auto-fill the form');
console.log('🔧 Use F12 to inspect validation and payment flow');

// Initialize the payment system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add loading screen effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';

    setTimeout(() => {
        document.body.style.opacity = '1';

        // Initialize SecurePay system
        window.securePayment = new SecurePayment();

        // Add global demo functions
        window.fillDemoData = fillDemoData;

        console.log('✅ SecurePay system initialized successfully');

    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🔒 SecurePay tab hidden - payment processing paused');
    } else {
        console.log('👁️ SecurePay tab visible - payment processing resumed');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to fill demo data
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        fillDemoData();
        console.log('📝 Demo data filled');
    }

    // Ctrl/Cmd + R to reset form
    if ((e.ctrlKey || e.metaKey) && e.key === 'r' && window.securePayment) {
        e.preventDefault();
        window.securePayment.resetForm();
        console.log('🔄 Form reset');
    }
});

// Export for potential extension
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurePayment;
}