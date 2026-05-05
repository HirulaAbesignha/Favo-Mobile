# Favo Mobile Platform - Technical Documentation

This document outlines the core modules of the Favo platform, detailing the business logic, validation rules, and key code implementations for Item, Booking, Staff, Payment, Complaint, Cart, Order, and Visitor management.

---

---

## 1. Item Management
Manages the inventory of retail products and services. Supports multi-variant inventory tracking (sizes) and category-based organization.

### Key Logic
- **Inventory Tracking**: Items store stock quantities per size (S, M, L).
- **Service vs. Product**: Items are classified as 'Product' or 'Service' to drive different user flows.

### Validations & File Locations
- **Category Required**  
  - **File**: `backend/models/Item.js` (Line 7)
  - **Code**: `required: [true, 'Category is required']`
- **Price Required & Non-Negative**  
  - **File**: `backend/models/Item.js` (Line 32)
  - **Code**: `required: [true, 'Price is required'], min: [0, 'Price cannot be negative']`

### Backend Implementation
- **File**: `backend/controllers/itemController.js`
- **Auto-Stock Calculation**: When sizes are updated, `stockQuantity` is automatically recalculated using `reduce()` (Line 64).
- **Auto-Availability**: If `stockQuantity` hits 0, `availabilityStatus` is automatically set to 'Maintenance' (Line 69).
- **Asset Cleanup**: Deleting an item automatically removes its corresponding image file from the `uploads/` directory (Line 95).

---

## 2. Booking Management
Handles product orders and service inquiries separately.

### Key Logic
- **Separation of Concerns**: 
  - **Orders**: identified by `totalAmount > 0` and presence of `itemId`.
  - **Bookings (Service)**: identified by `totalAmount === 0`.

### Backend Implementation
- **File**: `backend/controllers/bookingController.js`
- **Status Control**: Admins use `updateBookingStatus` to transition bookings through the 'Confirmed', 'Completed', and 'Cancelled' lifecycle (Line 115).
- **Customer Visibility**: `getMyBookings` ensures users only see their own rental history (Line 67).

---

## 3. Staff Management
Handles administrative staff and service provider records.

### Backend Implementation
- **File**: `backend/controllers/staffController.js`
- **Staff Tracking**: Supports basic CRUD for internal team members.
- **Role Sync**: Staff profiles help link service providers to specific booking categories.

---

## 4. Payment Management
Secures financial transactions for retail orders.

### Key Logic
- **Auto-Generation**: A payment record is automatically created upon successful checkout (`checkout.tsx`).

### Backend Implementation
- **File**: `backend/controllers/paymentController.js`
- **Transaction Security**: `createPayment` validates amount and booking references (Line 7).
- **Status Verification**: Payments start as 'Paid' when created via checkout, representing a successful transaction.

---

## 5. Complaint Management
Provides a feedback loop for customers to report issues.

### Backend Implementation
- **File**: `backend/controllers/complaintController.js`
- **Resolution Flow**: `updateComplaintStatus` requires an `adminResponse` to provide feedback to the user (Line 72).
- **Sorting**: Queries are sorted by `createdAt: -1` to prioritize new issues (Line 31).

---

## 6. Cart Management
Handles the temporary storage and quantity management of retail products before checkout.

### Key Logic
- **Global State**: Uses `CartContext` to persist items across all screens.
- **Auto-Calculation**: Subtotal and Grand Totals are calculated in real-time within the context.

---

## 7. Order Management (Checkout)
A multi-step process for converting cart items into confirmed retail orders.

### Frontend Logic
- **Three-Step Flow**: Billing Details -> Payment Details -> Order Review.
- **Validation**: Strict checks for Card Number (16 digits), Expiry (MM/YY), and Phone (10 digits).

---

## 8. Visitor Management
Manages physical visits for product pickups, returns, and service inquiries.

### Backend Implementation
- **File**: `backend/controllers/visitorController.js`
- **Flexible Scheduling**: `createVisitor` captures name, phone, and purpose while optionally linking to a `relatedBookingId` (Line 9).
- **Status Lifecycle**: Supports 'Scheduled', 'Checked-In', and the custom 'Done' status for pickups (Line 82).
- **Sorting**: Visits are sorted by creation date to show recent appointments first (Line 42).
