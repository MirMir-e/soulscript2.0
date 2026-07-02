# Soul Script - Custom Poem Ordering Platform

A full-stack web application for ordering custom poems with real-time communication between clients and writers.

## Features

✨ **Key Features:**
- ✅ Unique Ticket IDs for each poem request
- ✅ Real-time Chat between clients and writers using Socket.io
- ✅ Admin approval system for writers
- ✅ Privacy - Clients only see their own orders
- ✅ Secure Authentication with JWT tokens
- ✅ 100 KSH per page pricing
- ✅ Delivery tracking
- ✅ Beautiful responsive UI with React
- ✅ Admin dashboard for platform management

## Technology Stack

**Backend:**
- Node.js with Express
- MongoDB for database
- Socket.io for real-time communication
- JWT for authentication
- Bcryptjs for password hashing

**Frontend:**
- React 19.2.7
- React Scripts 5.0.1
- Socket.io-client
- Testing libraries

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Setup Steps

1. **Clone the repository**
```bash
cd soulscript2.0
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/soul-script
JWT_SECRET=your_secure_jwt_secret_key
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the application**

**Option 1: Development Mode (React only)**
```bash
npm start
```
Access at `http://localhost:3000`

**Option 2: Full Stack (React + Backend)**
Open two terminals:

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm start
```

## User Roles & Workflows

### Client (Patron)
1. Register and login
2. Create poem requests with:
   - Topic and description
   - Poem type (Sonnet, Haiku, etc.)
   - Number of pages (100 KSH per page)
   - Delivery date (optional)
3. View request status
4. Chat with assigned writer
5. Receive completed poems
6. Only see their own orders

### Writer
1. Register and wait for admin approval
2. Browse available poem requests
3. Accept requests to start writing
4. Chat with clients about requirements
5. Submit completed poems
6. Deliver poems to clients
7. Track earnings and completed orders

### Admin
1. Login with admin credentials
2. Approve or reject new writers
3. View platform statistics
4. Monitor all poem requests
5. Manage users and requests

## Default Admin Credentials

```
Email: admin@soulscript.com
Password: Admin@123
```

⚠️ **Change these credentials in production!**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Requests
- `POST /api/requests` - Create poem request
- `GET /api/requests/my-requests` - Get user's requests
- `GET /api/requests/available` - Get available requests (writers)
- `POST /api/requests/:id/assign` - Assign request to writer

### Poems
- `POST /api/poems/:requestId/submit` - Submit completed poem
- `POST /api/poems/:requestId/deliver` - Deliver poem
- `GET /api/poems/delivered` - Get delivered poems (clients)

### Chat
- `POST /api/chat/conversations/:requestId` - Start conversation
- `POST /api/chat/send` - Send message
- `GET /api/chat/conversations/:conversationId/messages` - Get messages

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/writers/pending` - Get pending writers
- `POST /api/admin/writers/:id/approve` - Approve writer
- `POST /api/admin/writers/:id/reject` - Reject writer
- `GET /api/admin/requests` - Get all requests

## Project Structure

```
soulscript2.0/
├── package.json
├── .env
├── .gitignore
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── PoemRequest.js
│   ├── Message.js
│   └── Admin.js
├── routes/
│   ├── auth.js
│   ├── requests.js
│   ├── poems.js
│   ├── chat.js
│   └── admin.js
├── middleware/
│   ├── auth.js
│   └── admin.js
├── src/ (React components)
├── public/ (Static files)
└── README.md
```

## Pricing

- **Standard Rate:** 100 KSH per page
- **Flexible Delivery:** Optional expedited delivery

## Security Features

- JWT-based authentication
- Password hashing with Bcryptjs
- Role-based access control
- Admin approval requirement for writers
- Order privacy (clients only see their own)
- Secure WebSocket connections

## Available Scripts

### `npm start`
Runs the React app in development mode.

### `npm run server`
Runs the Express backend server.

### `npm run build`
Builds the React app for production.

### `npm test`
Runs the test suite.

## Future Enhancements

- Payment gateway integration (M-Pesa, Stripe)
- Email notifications
- Writer portfolio/ratings system
- Advanced search and filtering
- Revision history
- PDF export for poems
- Mobile app
- Analytics dashboard

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`

### Socket.io Connection Issues
- Check firewall settings
- Verify port 5000 is available

### Admin Login Not Working
- Verify admin credentials in `.env`
- Check database for admin record

## Support

For issues or questions, please create an issue in the repository.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Soul Script** - Express Your Soul Through Poetry ✍️
