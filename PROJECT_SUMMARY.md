# E-Lib: Digital Library Management System
## Abstract Project Summary

---

## 📋 Project Overview

**E-Lib** is a full-stack web application that digitizes library management. It enables students to browse, request, and borrow books online while allowing librarians/admins to manage inventory and approve borrowing requests.

### Real-World Use Cases
- School & College digital library portals
- Public library online borrowing systems
- Publisher controlled access to digital books

---

## 🏗️ Architecture

### Technology Stack
```
Frontend:  React + Vite + Context API
Backend:   Node.js + Express + MongoDB
Database:  MongoDB (Cloud: Atlas / Local: Docker)
Storage:   File uploads (Images, PDFs)
```

### Core Concepts Applied

#### BACKEND (Node.js + Express + MongoDB)

1. **Server Setup (server.js)**
   - Express app initialization
   - CORS middleware for cross-origin requests
   - Static file serving for uploads
   - Error handling middleware

2. **Database Schemas (Models)**
   - **User**: name, email, password, role (student/admin)
   - **Book**: title, author, category, thumbnail, PDF, quantity tracking
   - **Borrow**: userId, bookId, approval status, timestamps

3. **Controllers - Business Logic**
   - **authController**: User registration & login
   - **bookController**: CRUD operations + quantity management
   - **borrowController**: Request submission, approval/rejection, returns

4. **Routes - API Endpoints**
   - Authentication: POST /register, /login
   - Books: GET all, POST create, PUT update, DELETE
   - Borrowing: GET pending (admin), POST request, PUT approve/reject/return

5. **Middleware**
   - **adminCheck**: Verifies user role before allowing admin operations

---

#### FRONTEND (React + Context API)

1. **Context Providers (Global State Management)**
   - **AuthContext**: User authentication & session persistence
   - **SearchContext**: Book search/filter state
   - **ToastContext**: Toast notifications for user feedback

2. **Components**
   - Navbar: Navigation & user menu
   - ProtectedRoute: Restrict pages to authenticated users
   - SectionWrapper: Reusable container styling

3. **Pages**
   - Home: Landing page
   - Login/Register: Authentication
   - Books: Browse & request books
   - BookDetails: Individual book info
   - BorrowedBooks: User's approved borrowed books
   - Dashboard: User profile
   - AdminPanel: Book & request management

4. **Services**
   - api.js: Axios instance for API calls with base URL configuration

---

## 🔄 Key Features & Workflows

### Student/User Flow
```
1. Register → Create account (email, password, name)
2. Login → Authenticate & store session
3. Browse Books → View available books with quantity info
4. Request Borrow → Submit borrow request (status: pending)
5. View Requests → See pending/approved status
6. Download PDF → Access approved book PDF
7. Return Book → Decrease available quantity & remove from list
```

### Admin/Librarian Flow
```
1. Login → Admin credentials required
2. Add Books → Create new books with quantity & files
3. Manage Inventory → Update book quantities
4. Review Requests → View pending borrow requests
5. Approve → Decrease available quantity (approve request)
6. Reject → Deny request with optional reason
7. Monitor → Track all borrowing records
```

---

## 📊 Database Structure

### Collections

**Users Collection**
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  role: "student" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

**Books Collection**
```
{
  _id: ObjectId,
  title: String,
  author: String,
  category: String,
  thumbnail: String (image path),
  pdfFile: String (file path),
  uploadedBy: String (admin email),
  quantity: Number (total copies),
  availableQuantity: Number (currently available),
  status: "Available" | "Issued",
  uploadedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Borrows Collection**
```
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  bookId: ObjectId (reference to Book),
  status: "pending" | "approved" | "rejected",
  borrowedAt: Date,
  approvedAt: Date (when admin approved),
  rejectedAt: Date (when admin rejected),
  rejectionReason: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 API Endpoints Summary

### Authentication
| Method | Endpoint | Payload | Response |
|--------|----------|---------|----------|
| POST | `/api/auth/register` | {name, email, password} | {user, message} |
| POST | `/api/auth/login` | {email, password} | {user, message} |

### Books Management
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/books` | Any | Fetch all books |
| POST | `/api/books` | Admin | Create new book |
| PUT | `/api/books/:id` | Admin | Update book details |
| PUT | `/api/books/:id/quantity` | Admin | Update book quantity |
| DELETE | `/api/books/:id` | Admin | Delete book |

### Borrowing System
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/borrow` | User | Submit borrow request |
| GET | `/api/borrow/user/:userId` | User | Get approved borrowed books |
| GET | `/api/borrow/admin/pending` | Admin | View pending requests |
| PUT | `/api/borrow/admin/approve/:borrowId` | Admin | Approve request |
| PUT | `/api/borrow/admin/reject/:borrowId` | Admin | Reject request |
| POST | `/api/borrow/return` | User | Return a book |

---

## 🚀 Setup & Running

### Prerequisites
- Node.js 14+
- MongoDB (Atlas Cloud or Local)
- npm or yarn

### Installation & Start

**Backend Setup**
```bash
cd Backend
npm install
npm start  # Runs on http://localhost:4000
```

**Frontend Setup**
```bash
cd Frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Environment Variables (.env in Backend)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/e-lib
PORT=4000
NODE_ENV=development
```

---

## 📁 Project Structure

```
E-Lib/
├── Backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Business logic
│   ├── models/                   # Database schemas
│   ├── routes/                   # API endpoints
│   ├── middleware/               # Auth checks
│   ├── uploads/                  # File storage
│   ├── server.js                 # Express app entry
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Route pages
│   │   ├── context/              # Context API providers
│   │   ├── services/api.js       # Axios config
│   │   ├── styles/               # CSS files
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── vite.config.js
│   └── package.json
│
└── PROJECT_SUMMARY.md            # This file
```

---

## 🔐 Security Features

- **User Authentication**: Email/password with localStorage session
- **Role-Based Access**: Admin-only endpoints protected
- **Data Validation**: Input validation on both client & server
- **CORS**: Enabled for frontend-backend communication

---

## ✨ Key Implementation Notes

1. **Stateless Design**: Backend doesn't store sessions; relies on localStorage in frontend
2. **Quantity Tracking**: Books have total & available quantities for inventory management
3. **Approval Workflow**: Borrow requests go through admin approval for control
4. **File Upload Handling**: Images & PDFs stored separately in uploads folder
5. **Error Handling**: Consistent error responses across all endpoints

---

## 📝 Code Quality Standards

- **Modular Structure**: Separation of concerns (routes, controllers, models)
- **Clear Comments**: Core concepts highlighted throughout codebase
- **RESTful API**: Standard HTTP methods for CRUD operations
- **Context API**: Efficient global state management in React
- **Async/Await**: Modern Promise handling in JavaScript

---

## 🎯 Future Enhancement Possibilities

- Email notifications for requests
- Due date tracking & late fees
- Book ratings & reviews
- Advanced search with filters
- Payment integration for premium features
- Real-time updates with WebSockets

---

*Last Updated: December 2025*
*E-Lib: Your Digital Library Solution*
