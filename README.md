# Pet Reminder App

This is a fullstack pet reminder application with:
- **Frontend:** Next.js (React, PWA, offline-first, skeleton loading, modern UI)
- **Backend:** Node.js/Express with SQLite (REST API)

---

## Getting Started

### 1. **Backend Setup**

1. Go to the backend directory:
   ```bash
   cd pet-remainder-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node index.js
   ```
   The backend will run on [http://localhost:4000](http://localhost:4000) by default.

### 2. **Frontend Setup**

1. Go to the frontend directory (this repo):
   ```bash
   cd pet-remainder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Set the API base URL for production:
   - Create a `.env.production` file:
     ```env
     NEXT_PUBLIC_API_BASE=https://your-backend-domain.com
     ```
   - In development, the app uses `http://localhost:4000` by default.
4. Start the frontend server:
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:3000](http://localhost:3000).

---

## Features
- Add, edit, delete, and mark reminders as done
- Filter by pet, category, and date
- Calendar with streak tracking
- Offline-first: works without internet, syncs when back online
- Skeleton loading UI
- PWA support (installable, works offline)

---

## Deployment

- **Frontend:** Deploy to Vercel, Netlify, or any Next.js-compatible host.
- **Backend:** Deploy to Render, Railway, Heroku, or your own VPS.
- Set `NEXT_PUBLIC_API_BASE` in your frontend environment variables to your backend's deployed URL.
- Make sure CORS in your backend allows your frontend domain.

---

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
