# MediReturn Backend Documentation

## Overview
MediReturn is a prescription drug take-back platform designed to facilitate the safe disposal of unused medications. The platform connects citizens with collection points, allowing for easy scheduling of pickups and tracking of environmental impact.

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for Node.js to handle routing and middleware.
- **MongoDB**: NoSQL database for storing user and collection point data.
- **Mongoose**: ODM for MongoDB to manage data relationships and schema.
- **JWT**: For secure user authentication and authorization.
- **Bcrypt**: For password hashing.

## Project Structure
```
backend
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seeds
│   ├── utils
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd medireturn/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and fill in the required environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### Running the Application
To start the server, run:
```
npm start
```
The server will run on `http://localhost:5000`.

### API Endpoints
- **Authentication**
  - POST `/api/auth/register`: Register user
  - POST `/api/auth/login`: Login user
  - POST `/api/auth/logout`: Logout user
  - GET `/api/auth/me`: Get current user

- **Users**
  - GET `/api/users/profile`: Get user profile
  - PUT `/api/users/profile`: Update user profile
  - GET `/api/users/dashboard`: Get citizen dashboard
  - GET `/api/users/transactions`: Get user transactions
  - GET `/api/users/leaderboard/:city`: Get city leaderboard

- **Collection Points**
  - POST `/api/collection-points`: Register collection point
  - GET `/api/collection-points`: Get all collection points
  - GET `/api/collection-points/:id`: Get single collection point
  - GET `/api/collection-points/my/point`: Get my collection point
  - GET `/api/collection-points/my/dashboard`: Get collection point dashboard
  - PUT `/api/collection-points/:id`: Update collection point

- **Pickups**
  - POST `/api/pickups`: Schedule pickup
  - GET `/api/pickups/my`: Get my pickups
  - GET `/api/pickups/:id`: Get single pickup
  - PUT `/api/pickups/:id/accept`: Accept pickup
  - PUT `/api/pickups/:id/reject`: Reject pickup
  - PUT `/api/pickups/:id/complete`: Complete pickup
  - PUT `/api/pickups/:id/cancel`: Cancel pickup
  - GET `/api/pickups/collection-point/all`: Get collection point pickups

- **Admin**
  - GET `/api/admin/analytics`: Get platform analytics
  - GET `/api/admin/users`: Get all users
  - GET `/api/admin/collection-points`: Get all collection points
  - GET `/api/admin/collection-points/pending`: Get pending collection points
  - PUT `/api/admin/collection-points/:id/approve`: Approve collection point
  - DELETE `/api/admin/collection-points/:id/reject`: Reject collection point
  - PUT `/api/admin/users/:id/toggle-status`: Toggle user status

## Admin Credentials
- Email: admin@medireturn.com
- Password: admin123

## Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy