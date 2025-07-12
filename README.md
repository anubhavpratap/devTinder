# devTinder Backend

The backend for [devTinder](https://devtinder.biz/), a developer-focused social and networking platform. This Node.js/Express API powers user authentication, real-time chat, connection requests, profile management, and premium membership features.

- **Frontend Repo:** [devtinderfront](https://github.com/anubhavpratap/devtinderfront)
- **Backend Repo:** [devtinder](https://github.com/anubhavpratap/devtinder)
- **Live Demo:** [devtinder.biz](https://devtinder.biz/)

---

## Features

- **User Authentication:** Signup, login, logout with JWT and password hashing.
- **Profile Management:** View and edit user profiles with validation.
- **Connection Requests:** Send, accept, reject, and manage connection requests.
- **Feed:** Discover new users, excluding those already connected or requested.
- **Real-Time Chat:** 1:1 chat using Socket.io with online status and message persistence.
- **Premium Membership:** Payment verification and premium status management.
- **Email Notifications:** (AWS SES integration, partially implemented).

---

## Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** (via Mongoose)
- **Socket.io** (real-time chat)
- **JWT** (authentication)
- **AWS SES** (email, optional)
- **bcrypt** (password hashing)
- **dotenv**, **validator**, **cookie-parser**, **cors**

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- (Optional) AWS SES credentials for email

### Installation

```bash
git clone https://github.com/anubhavpratap/devtinder.git
cd devtinder
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret
# AWS SES (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
```

### Running the Server

```bash
npm run dev
```

The server will start on the port specified in `.env`.

---

## API Overview

### Auth

- `POST /signup` — Register a new user
- `POST /login` — Login and receive JWT
- `POST /logout` — Logout user

### Profile

- `GET /profile/view` — View logged-in user's profile
- `PATCH /profile/edit` — Edit profile fields

### Users & Feed

- `GET /feed` — Get list of users to connect with
- `GET /user/requests/received` — View incoming connection requests
- `GET /user/connections` — View accepted connections

### Connection Requests

- `POST /request/send/:status/:toUserId` — Send a connection request (`status`: `interested` or `ignored`)
- `POST /request/review/:status/:requestId` — Accept or reject a request (`status`: `accepted` or `rejected`)

### Chat

- `GET /chat/:targetUserId` — Get or create chat with another user (real-time via Socket.io)

### Payment

- `POST /payment/verify` — Verify payment and upgrade to premium

---

## Real-Time Chat

- Uses Socket.io for real-time messaging.
- Users join a private room for 1:1 chat.
- Online status and last seen are tracked.
- Messages are persisted in MongoDB.

---

## Project Structure

```
src/
  app.js                # Main entry point
  config/database.js    # MongoDB connection
  middlewares/auth.js   # JWT authentication middleware
  models/               # Mongoose models (User, Chat, ConnectionRequest)
  routes/               # Express route handlers
  utils/                # Utility functions (validation, email, socket)
```

---

## License

ISC

---

## Author

[anubhavpratap](https://github.com/anubhavpratap)

---
