

---

# Real-Time Auction Platform

A **full-stack real-time auction system** that allows sellers to create auctions and buyers to place bids live. The system supports **real-time updates**, **bid validation**, and **highest bidder tracking**, making it ideal for online auction scenarios.

---

## 🔹 Features

### Seller Features

* Create auctions with:

  * Title, description
  * Start price and bid increment
  * Start and end times
* Start or end auctions manually
* Track active and ended auctions

### Buyer Features

* Place bids on active auctions
* Real-time bid updates via **Socket.io**
* Minimum bid validation: bid must be **current bid + increment**

### Public Features

* View list of all auctions and their status
* See **current highest bid** for active auctions
* After auction ends, see **highest bid and the user who placed it**

### Real-Time & Backend Features

* **Redis caching** for high-performance bid tracking
* **Socket.io** for live updates
* PostgreSQL + Sequelize ORM for data management
* Supabase authentication for secure login

---

## 🔹 Tech Stack

| Layer             | Technology                     |
| ----------------- | ------------------------------ |
| Frontend          | React, Tailwind CSS, shadcn/ui |
| Backend           | Node.js, Express.js, Sequelize |
| Database          | PostgreSQL                     |
| Cache / Real-Time | Redis, Socket.io               |
| Auth              | Supabase Auth                  |

---

## 🔹 Project Structure

```
project-root/
│
├─ backend/
│  │  ├─ models/           # Sequelize models (Auction, Bid, User)
│  │  ├─ routes/           # Express routes (auctions.js, bids.js)
│  │  ├─ services/         # Auction services (Redis caching)
│  │  ├─ middleware/       # Supabase authentication
│  │  └─ config/           # Database configuration
│  └─ index.js             # Express server + Socket.io
│
├─ frontend/
│  ├─ src/
│  │  ├─ pages/            # React pages (Auctions, AuctionDetail)
│  │  ├─ components/       # Reusable UI components
│  │  └─ lib/              # API helper
│  └─ main.jsx
│
├─ .env                     # Environment variables
└─ README.md
```

---

## 🔹 Installation

### Prerequisites

* Node.js v20+
* PostgreSQL
* Redis

### Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure `.env`:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/auctiondb
REDIS_URL=redis://localhost:6379
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run migrations (if using Sequelize CLI) and start server:

```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure `.env`:

```env
VITE_API_BASE=http://localhost:5000
```

3. Start development server:

```bash
npm run dev
```

---

## 🔹 API Endpoints

### Auctions

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | /auctions            | List all auctions                |
| POST   | /auctions            | Create auction (seller only)     |
| GET    | /auctions/\:id       | Get single auction + current bid |
| POST   | /auctions/\:id/start | Start auction (seller only)      |
| POST   | /auctions/\:id/end   | End auction (seller only)        |

### Bids

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| POST   | /bids    | Place bid (buyer only) |

---

## 🔹 Real-Time Features

* **Socket.io** broadcasts live bid updates to all connected clients.
* Highest bid and bidder info updated **in real-time**.
* Redis caching ensures fast retrieval of current highest bid.

---

## 🔹 Frontend Features

* Display **current bid and live updates**
* Show **highest bidder** once auction ends
* Automatically hide bid input when auction ends
* Optional: Countdown timer for start/end of auction

---

## 🔹 License

This project is released under the **MIT License**.

---

## 🔹 Future Enhancements

* Countdown timers for **auction start and end**
* Notifications to buyers when they are outbid
* Pagination and filtering for auctions
* Enhanced analytics for sellers

---

