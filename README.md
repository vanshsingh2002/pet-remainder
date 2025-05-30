# Pet Reminder App

This is a fullstack pet reminder application with:
- **Frontend:** Next.js (React, PWA, offline-first, skeleton loading, modern UI)
- **Backend:** Node.js/Express with SQLite (REST API)

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vanshsingh2002/pet-remainder
cd pet-remainder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.production` file in the root directory and configure your environment variables:
```env
NEXT_PUBLIC_API_BASE=https://your-backend-domain.com
```

## Running the Application

To start the development server:
```bash
npm run dev
```

## Features
- Add, edit, delete, and mark reminders as done
- Filter by pet, category, and date
- Calendar with streak tracking
- Offline-first: works without internet, syncs when back online
- Skeleton loading UI
- PWA support (installable, works offline)

---
