# 🚗 CampusPool - College Carpooling App

A sleek, modern carpooling application designed for college students to coordinate rides with their peers. Features a beautiful red and white design with car-themed elements.

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Backend](https://img.shields.io/badge/backend-express-blue)
![Frontend](https://img.shields.io/badge/frontend-react-blue)
![Tests](https://img.shields.io/badge/tests-150%2B-success)

## ✨ Features

### Core Functionality
- 🔐 **Complete Authentication System** - Secure signup, login, and session management
- 👥 **Dual User Types** - Different flows for students with/without cars
- 📝 **Carpool Request Feed** - Post and browse ride requests and offers
- 💬 **Direct Messaging** - DM system with accept/deny functionality
- 👤 **User Profiles** - Detailed profiles with college info and car details
- ✏️ **Profile Editing** - Update your information anytime

### Design
- 🎨 **Modern UI** - Sleek red and white color scheme
- 🚗 **Car-Themed Elements** - Dashboard gauges, speedometers, and automotive styling
- 📱 **Responsive** - Works on desktop and mobile
- 🎯 **Clear Indicators** - Visual distinction between requesting/offering rides

### Technical
- ✅ **150+ Unit Tests** - Comprehensive test coverage with Jest
- 🔄 **Real-time Updates** - Live feed updates (polling-based)
- 🗄️ **Database Agnostic** - Easily swap backends (in-memory, PostgreSQL, MongoDB, etc.)
- 🚀 **Production Ready** - Deploy anywhere (Heroku, Railway, Vercel, etc.)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3001`

### 2. Start the Frontend

```bash
npm install  
npm start
```

Frontend runs on `http://localhost:3000`

### 3. Create an Account

1. Navigate to `http://localhost:3000`
2. Click "Create Account"
3. Set up your profile
4. Start carpooling!

**That's it!** 🎉

For detailed instructions, see [QUICK_START.md](./QUICK_START.md)

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Full deployment documentation
- **[TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md)** - Testing guide and coverage
- **[backend/README.md](./backend/README.md)** - Backend API documentation

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓
Generic API Client (/utils/api/client.ts)
    ↓
Backend (Express.js + JWT)
    ↓
Data Store (In-Memory / PostgreSQL / MongoDB)
```

### Key Directories

```
├── components/          # React components
│   ├── FeedPage.tsx    # Main carpool feed
│   ├── MessagesPage.tsx # Messaging interface
│   ├── ProfilePage.tsx  # User profiles
│   └── ui/             # Reusable UI components (shadcn)
├── utils/
│   ├── api/            # API client
│   ├── config.ts       # App configuration
│   └── __tests__/      # Unit tests
├── backend/
│   ├── server.js       # Express server
│   ├── dataStore.js    # Database abstraction
│   └── package.json    # Backend dependencies
└── styles/             # Global styles
```

## 🔧 Configuration

### Change Backend URL

Edit `/utils/config.ts`:

```typescript
export const config = {
  apiUrl: 'https://your-backend.com/api',
  pollingInterval: 5000,
};
```

### Switch Database

The backend uses in-memory storage by default. To use a real database:

**PostgreSQL:**
```bash
cd backend
npm install pg
```

Edit `dataStore.js` to use PostgreSQL adapter (see comments in file)

**MongoDB:**
```bash
cd backend
npm install mongodb
```

Edit `dataStore.js` to use MongoDB adapter (see comments in file)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test UserValidator.test.ts
```

**Test Coverage:** 150+ tests covering validators, utilities, and data handlers

## 🚢 Deployment

### Deploy Backend

**Heroku:**
```bash
cd backend
heroku create campuspool-backend
git push heroku main
```

**Railway:**
```bash
cd backend
railway init
railway up
```

**Render:**
Connect your GitHub repository and deploy the `/backend` directory

### Deploy Frontend

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔐 Security Notes

- ⚠️ **Change JWT Secret** in production (backend/.env)
- ⚠️ Use **HTTPS** in production
- ⚠️ Configure **CORS** properly
- ⚠️ Use a **real database** for production
- ⚠️ Implement **rate limiting** for auth endpoints

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with TypeScript
- **Tailwind CSS** v4.0 for styling
- **shadcn/ui** for component library
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin support

### Testing
- **Jest** - Test framework
- **150+ tests** - Comprehensive coverage

## 📱 Features by User Type

### Students Without Cars
- ✅ Request rides to specific destinations
- ✅ Browse available ride offers
- ✅ Message car owners
- ✅ View driver profiles

### Students With Cars
- ✅ Offer rides to other students
- ✅ See ride requests
- ✅ Accept/deny message requests
- ✅ Coordinate through DMs

## 🤝 Contributing

This is a college project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🎓 About

CampusPool was created as a college carpooling solution to help students coordinate rides efficiently. Built with modern web technologies and a focus on user experience.

## 🐛 Troubleshooting

### Backend won't connect
- Ensure backend is running: `cd backend && npm start`
- Check `/utils/config.ts` has correct URL
- Verify port 3001 is not in use

### CORS errors
- Backend has CORS enabled by default
- For custom domains, update CORS settings in `backend/server.js`

### Authentication issues
- Clear browser localStorage
- Sign in again to get fresh token
- Check JWT_SECRET is set in backend/.env

For more help, see [QUICK_START.md](./QUICK_START.md#common-issues)

## 📞 Support

- 📖 Check documentation files
- 🐛 Report issues via GitHub Issues
- 💬 View console logs for errors

---

**Made with ❤️ for college students**

Happy carpooling! 🚗💨
