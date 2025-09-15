# Phishing Demo Suite

A comprehensive demonstration suite featuring both Facebook login and payment processing phishing simulations with database storage capabilities.

## 🎯 Overview

This project contains two separate phishing demonstration applications:

1. **Facebook Clone** - Captures login credentials (email/password)
2. **Payment Demo** - Captures credit card and billing information

Both applications store captured data in JSON databases and provide admin dashboards for monitoring.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Windows PowerShell or Command Prompt

### 🔥 One-Command Setup

Run both servers simultaneously using these commands:

#### Option 1: PowerShell (Recommended)
```powershell
# Terminal 1 - Facebook Clone Server
cd "d:\Documents\Phish\facebook-clone"
npm install
node server.js

# Terminal 2 - Payment Demo Server (open new terminal)
cd "d:\Documents\Phish\payment-demo"
npm install
node server.js
```

#### Option 2: Using Start-Process (Background)
```powershell
# Start Facebook Clone Server
cd "d:\Documents\Phish\facebook-clone"
npm install
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"

# Start Payment Demo Server
cd "d:\Documents\Phish\payment-demo"
npm install
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js"
```

## 📱 Access URLs

Once both servers are running, access the applications:

### Facebook Clone (Port 3000)
- **Main Site**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Test Interface**: `http://localhost:3000/database-test.html`

### Payment Demo (Port 3001)
- **Main Site**: `http://localhost:3001`
- **Admin Dashboard**: `http://localhost:3001/admin`
- **Test Interface**: `http://localhost:3001/payment-test.html`

## 🎯 How to Use

### Facebook Clone Testing
1. Visit `http://localhost:3000`
2. Enter any valid email format (e.g., `test@example.com`)
3. Enter any password with 6+ characters (e.g., `password123`)
4. Click "Log In"
5. View captured data at `http://localhost:3000/admin`

### Payment Demo Testing
1. Visit `http://localhost:3001`
2. Use test card: `4111 1111 1111 1111` (Visa)
3. Enter any name, `12/25` expiry, `123` CVV
4. Fill billing address and email
5. Submit payment
6. View captured data at `http://localhost:3001/admin`

## 📊 Database Files

Both applications store data in JSON files:
- **Facebook Clone**: `facebook-clone/database.json`
- **Payment Demo**: `payment-demo/payments-database.json`

### Facebook Clone Data Format
```json
[
  {
    "id": 1694123456789,
    "email": "user@example.com",
    "password": "their_password",
    "timestamp": "2025-09-14T15:30:45.123Z",
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0..."
  }
]
```

### Payment Demo Data Format
```json
[
  {
    "id": 1694123456789,
    "transactionId": "TXN-12345678-ABC123",
    "cardNumber": "4111111111111111",
    "cardholderName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123",
    "email": "john@example.com",
    "address": "123 Main St",
    "amount": 31.49,
    "success": true,
    "timestamp": "2025-09-14T15:30:45.123Z"
  }
]
```

## 🛠️ Project Structure

```
d:\Documents\Phish/
├── facebook-clone/              # Facebook login clone
│   ├── server.js               # Express server (port 3000)
│   ├── database.json           # Captured login credentials
│   ├── index.html              # Main Facebook login page
│   ├── admin.html              # Admin dashboard
│   ├── package.json            # Node.js dependencies
│   └── README.md               # Facebook clone documentation
│
├── payment-demo/               # Payment processing demo
│   ├── server.js               # Express server (port 3001)
│   ├── payments-database.json  # Captured payment data
│   ├── index.html              # Main payment page
│   ├── admin.html              # Payment admin dashboard
│   ├── package.json            # Node.js dependencies
│   └── README.md               # Payment demo documentation
│
└── README.md                   # This file
```

## 🔧 Admin Dashboard Features

### Facebook Clone Admin (`localhost:3000/admin`)
- 📊 View all captured login credentials
- 📈 Statistics: Total logins, unique emails, last login
- 📥 Export credentials as JSON
- 🗑️ Clear all stored data
- 🔄 Auto-refresh every 10 seconds

### Payment Demo Admin (`localhost:3001/admin`)
- 💳 View all captured payment information
- 📊 Payment analytics: Success rates, revenue, card types
- 📈 Statistics: Total transactions, unique customers
- 📥 Export payment data as JSON
- 🗑️ Clear all stored payment data
- 🔄 Auto-refresh every 15 seconds

## 🚨 Troubleshooting

### Server Won't Start
**Error**: `EADDRINUSE: address already in use`
**Solution**: The server is already running. Check for existing Node.js processes:
```powershell
Get-Process -Name node | Stop-Process -Force
```

### Admin Dashboard Shows "Server Offline"
**Solutions**:
1. Verify servers are running on correct ports (3000 and 3001)
2. Check Windows Firewall settings
3. Try refreshing the admin page
4. Restart the servers

### Database Not Saving Data
**Solutions**:
1. Check file permissions on the project directories
2. Ensure `database.json` and `payments-database.json` are writable
3. Check server console for error messages
4. Verify Node.js has write permissions

### Cannot Access from Other Devices
To access from other devices on your network:
1. Find your computer's IP address: `ipconfig`
2. Update server.js files to listen on `0.0.0.0` instead of `localhost`
3. Access using your IP: `http://[YOUR-IP]:3000` and `http://[YOUR-IP]:3001`

## 🔒 Security & Legal Notes

**⚠️ IMPORTANT DISCLAIMERS:**

1. **Educational Purpose Only**: These tools are for educational and demonstration purposes only
2. **No Malicious Use**: Do not use these tools for actual phishing or fraudulent activities
3. **Data Protection**: The captured data is stored in plain text - handle responsibly
4. **Legal Compliance**: Always follow applicable laws and regulations in your jurisdiction
5. **Ethical Guidelines**: Use only for authorized testing and educational purposes

### Production Security Considerations
- Never store passwords or credit card data in plain text
- Always use HTTPS in production
- Implement proper encryption for sensitive data
- Follow PCI DSS compliance for payment data
- Use proper authentication and authorization

## 📞 Support & Documentation

For detailed information about each component:
- **Facebook Clone**: See `facebook-clone/README.md`
- **Payment Demo**: See `payment-demo/README.md`

### Common Commands Reference
```powershell
# Check if servers are running
Get-Process -Name node

# Stop all Node.js processes
Get-Process -Name node | Stop-Process -Force

# Check port usage
netstat -an | findstr ":3000"
netstat -an | findstr ":3001"

# Start servers in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Documents\Phish\facebook-clone'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Documents\Phish\payment-demo'; node server.js"
```

## 📈 Features Summary

| Feature | Facebook Clone | Payment Demo |
|---------|---------------|--------------|
| **Port** | 3000 | 3001 |
| **Data Captured** | Email, Password | Credit Card, Billing Info |
| **Database File** | `database.json` | `payments-database.json` |
| **Admin Dashboard** | ✅ | ✅ |
| **Export Function** | ✅ | ✅ |
| **Auto-refresh** | ✅ (10s) | ✅ (15s) |
| **Statistics** | ✅ | ✅ |
| **Test Interface** | ✅ | ✅ |

---

**Remember**: Always use these tools responsibly and in accordance with applicable laws and ethical guidelines.