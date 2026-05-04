# Favo - Fashion Rental & Outfit Management Mobile Application

A premium full-stack mobile application built for a university Web and Mobile Technologies group assignment.

## Project Overview

**Favo** is a Fashion Rental & Outfit Management Mobile Application that allows users to browse fashion items, rent/book outfits, manage payments, submit complaints, track staff support, and manage visitor/pickup appointments.

## Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- Functional Components + React Hooks
- Expo Router (File-based Navigation)
- Axios for API calls
- TanStack React Query for server state
- AsyncStorage for local persistence
- Lucide React Native for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Multer for image uploads
- CORS enabled

### Database
- MongoDB Atlas
- Mongoose ODM
- ObjectId references for relationships

## Features

### Customer Features
- Browse fashion items with categories and filters
- View item details with pricing and availability
- Create booking requests for rental items
- View and cancel personal bookings
- Make payments for bookings
- Submit complaints with status tracking
- Schedule visitor/pickup appointments
- View profile and payment history

### Admin Features
- Dashboard with business analytics
- Manage fashion items (CRUD + image upload)
- Approve or reject customer bookings
- Manage staff members
- View and update all payments
- Handle customer complaints
- Track visitor appointments

## User Roles

| Role | Description |
|------|-------------|
| Customer | Can browse items, create bookings, make payments, submit complaints, schedule visits |
| Admin | Full access to dashboard, item management, booking approvals, staff, payments, complaints, visitors |

## Folder Structure

```
backend/
- server.js
- package.json
- config/db.js
- models/
  - User.js, Item.js, Booking.js, Staff.js, Payment.js, Complaint.js, Visitor.js
- controllers/
  - authController.js, itemController.js, bookingController.js, staffController.js,
    paymentController.js, complaintController.js, visitorController.js
- routes/
  - authRoutes.js, itemRoutes.js, bookingRoutes.js, staffRoutes.js,
    paymentRoutes.js, complaintRoutes.js, visitorRoutes.js
- middleware/
  - authMiddleware.js, roleMiddleware.js, uploadMiddleware.js, errorMiddleware.js
- uploads/
- utils/
  - generateToken.js, generateTransactionId.js

frontend/
- app/
  - index.tsx (Splash)
  - auth/ (Login, Register)
  - customer/ (Home, Items, Bookings, Profile, Payments, Complaints, Visitors)
  - admin/ (Dashboard, Items, Bookings, Staff, Payments, Complaints, Visitors)
- api/ (Axios config + API modules)
- components/ (Reusable UI components)
- context/ (AuthContext)
- constants/ (Colors, theme)
- utils/ (Validators)
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
UPLOAD_PATH=./uploads
```

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## Installation

### Backend
```bash
cd backend
npm install
# Create .env with your MongoDB Atlas URI and JWT secret
npm start
```

### Frontend
```bash
cd frontend
bun install
# Update api/axiosConfig.ts with your backend URL
bun run start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/items | Create item (Admin) |
| GET | /api/items | Get all items |
| GET | /api/items/:id | Get single item |
| PUT | /api/items/:id | Update item (Admin) |
| DELETE | /api/items/:id | Delete item (Admin) |
| POST | /api/items/:id/upload | Upload item image |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my-bookings | Get my bookings |
| GET | /api/bookings | Get all bookings (Admin) |
| PUT | /api/bookings/:id/status | Update status (Admin) |
| PUT | /api/bookings/:id/cancel | Cancel booking |
| DELETE | /api/bookings/:id | Delete booking (Admin) |

### Staff
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/staff | Create staff (Admin) |
| GET | /api/staff | Get all staff |
| PUT | /api/staff/:id | Update staff |
| DELETE | /api/staff/:id | Delete staff |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments | Create payment |
| GET | /api/payments/my-payments | Get my payments |
| GET | /api/payments | Get all payments (Admin) |
| PUT | /api/payments/:id/status | Update status (Admin) |
| DELETE | /api/payments/:id | Delete payment (Admin) |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/complaints | Create complaint |
| GET | /api/complaints/my-complaints | Get my complaints |
| GET | /api/complaints | Get all complaints (Admin) |
| PUT | /api/complaints/:id/status | Update status (Admin) |
| DELETE | /api/complaints/:id | Delete complaint (Admin) |

### Visitors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/visitors | Create visitor |
| GET | /api/visitors | Get all visitors (Admin) |
| PUT | /api/visitors/:id/status | Update status (Admin) |
| DELETE | /api/visitors/:id | Delete visitor (Admin) |

## Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render or Railway
3. Set environment variables (MONGO_URI, JWT_SECRET, PORT)
4. Deploy and copy the live URL

### Frontend Configuration
1. Update `frontend/api/axiosConfig.ts` with your deployed backend URL
2. Build with `eas build` or run locally with `bun run start`

## Team Members & Responsibilities

| Member | Entity | Focus Area | Backend | Frontend |
|--------|--------|-----------|---------|----------|
| Shared | User | Authentication | Register, Login, JWT, Middleware | Login, Register, AuthContext |
| Member 1 | Item | Product Management | CRUD, Upload, Filters | ItemList, ItemDetails, Admin Items |
| Member 2 | Booking | Rental Booking | Create, Approve, Cancel | MyBookings, ManageBookings |
| Member 3 | Staff | Support Management | CRUD Staff | ManageStaff |
| Member 4 | Payment | Financial Management | Create, Update Status | MyPayments, ManagePayments |
| Member 5 | Complaint | Customer Issues | Create, Update Status | Complaints, ManageComplaints |
| Member 6 | Visitor | Visitor Tracking | CRUD, Status Updates | VisitorSchedule, ManageVisitors |

## Viva Preparation

Each member should be able to explain:
- Their assigned module's database schema
- The API endpoints they built
- The frontend screens they implemented
- The business logic and validation rules
- How their module integrates with authentication

Key talking points:
- JWT token flow from login to protected routes
- Role-based access control (admin vs customer)
- Image upload with Multer
- MongoDB relationships using ObjectId
- React Query for server state management
- Expo Router file-based navigation

## Screenshots

Add screenshots of:
- Splash screen
- Login / Register
- Customer Home with featured items
- Item details with Book Now
- Admin Dashboard
- Manage Bookings with approve/reject
- Create Item form

## License

This project was created for educational purposes as part of a university group assignment.
