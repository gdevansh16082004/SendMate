# 💸 SendMate - Peer-to-Peer Money Transfer Application

A full-stack, secure money transfer application built with the MERN stack, featuring real-time transactions, JWT authentication, and comprehensive transaction history.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Features

### 🔐 Security First
- **Bcrypt Password Hashing** - All passwords are securely hashed with bcrypt (salt rounds: 10)
- **JWT Authentication** - Secure token-based authentication with 3-hour expiry
- **Protected Routes** - Client and server-side route protection
- **Rate Limiting** - API rate limiting (100 requests per 15 minutes per IP)
- **Helmet.js Security** - HTTP security headers
- **Input Validation** - Strong password requirements (min 8 chars, uppercase, lowercase, number)

### 💰 Core Features
- **User Registration & Authentication** - Secure signup/signin with email validation
- **Real-time Balance Updates** - Instant balance reflection after transactions
- **Peer-to-Peer Transfers** - Send money to other users by search
- **Transaction History** - Complete transaction log with pagination
- **User Search** - Find users by first name or last name
- **Transaction Integrity** - MongoDB sessions ensure ACID compliance

### 🎨 User Experience
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Toast Notifications** - Real-time feedback for all operations
- **Protected Routing** - Automatic redirect based on authentication status
- **Clean UI** - Modern, intuitive interface with Lucide icons

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Express Rate Limit** - Rate limiting middleware

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/gdevansh16082004/SendMate.git
cd SendMate
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/sendmate
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_NODE_ENV=development
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
SendMate/
├── backend/
│   ├── routes/
│   │   ├── user.js          # User authentication & profile routes
│   │   ├── account.js       # Account & transfer routes
│   │   ├── transactions.js  # Transaction history routes
│   │   ├── types.js         # Zod validation schemas
│   │   └── index.js         # Route aggregator
│   ├── db.js                # MongoDB models & connection
│   ├── middleware.js        # Auth middleware
│   ├── config.js            # Configuration
│   ├── index.js             # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Appbar.jsx
    │   │   ├── Balance.jsx
    │   │   ├── Users.jsx
    │   │   ├── SendMoney.jsx
    │   │   ├── Input.jsx
    │   │   ├── Button.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── PublicRoute.jsx
    │   ├── pages/
    │   │   ├── Signup.jsx
    │   │   ├── Signin.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── SendMoney.jsx
    │   │   └── Transactions.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - Register new user
- `POST /api/v1/user/signin` - User login
- `GET /api/v1/user/check-auth` - Verify token (protected)
- `GET /api/v1/user/me` - Get current user info (protected)

### User Management
- `PUT /api/v1/user/` - Update user profile (protected)
- `GET /api/v1/user/bulk?filter=<name>` - Search users

### Account Operations
- `GET /api/v1/account/balance` - Get account balance (protected)
- `POST /api/v1/account/transfer` - Transfer money (protected)

### Transactions
- `GET /api/v1/transactions/history?page=1&limit=10` - Get transaction history (protected)

## 🔒 Security Features Implemented

1. **Password Security**
   - Bcrypt hashing with salt rounds of 10
   - Password strength validation (8+ chars, uppercase, lowercase, number)

2. **Authentication**
   - JWT tokens with 3-hour expiration
   - Bearer token authentication
   - Protected route middleware

3. **API Security**
   - Helmet.js for HTTP headers
   - CORS configuration
   - Rate limiting (100 req/15min)
   - Input validation with Zod

4. **Database Security**
   - MongoDB transactions for data integrity
   - Parameterized queries (Mongoose)
   - Connection string in environment variables

5. **Frontend Security**
   - Protected routes with authentication checks
   - Token storage in localStorage
   - Automatic redirect on auth failure

## 🎯 Key Technical Highlights

### 1. Transaction Integrity
Uses MongoDB sessions to ensure atomic transactions:
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
    // Debit sender
    await Accounts.updateOne({ userId: sender }, 
        { $inc: { balance: -amount } }).session(session);
    
    // Credit receiver
    await Accounts.updateOne({ userId: receiver }, 
        { $inc: { balance: amount } }).session(session);
    
    await session.commitTransaction();
} catch (err) {
    await session.abortTransaction();
}
```

### 2. Secure Password Handling
```javascript
// Signup: Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10);

// Signin: Compare hashed passwords
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

### 3. Protected Routes
Both frontend (React Router) and backend (middleware) implement route protection:
```javascript
// Backend middleware
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
}
```

## 🚦 Running Tests

```bash
cd backend
npm test
```

## 📦 Deployment

### Backend (Render/Railway/Heroku)
1. Set environment variables in hosting platform
2. Deploy from GitHub repository
3. Update `FRONTEND_URL` in production environment

### Frontend (Vercel/Netlify)
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder
3. Update `VITE_API_URL` to production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Devansh Gupta**
- GitHub: [@gdevansh16082004](https://github.com/gdevansh16082004)

## 🙏 Acknowledgments

- Built as a learning project to demonstrate full-stack development skills
- Implements industry-standard security practices
- Production-ready architecture and code structure

---

⭐ Star this repository if you find it helpful!
