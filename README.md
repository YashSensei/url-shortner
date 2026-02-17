build frontend?
# URL Shortener (Scalable Backend Project)

A production-style URL shortener built to learn **backend engineering, system design, and scalability** — not just CRUD.

This project focuses on:
- Clean architecture
- Performance (Redis caching)
- Safety (rate limiting)
- Data hygiene (background cleanup jobs)

---

## 🚀 Features

- 🔗 Shorten URLs (no signup required)
- ⏱ Optional expiry for links
- ⚡ Fast redirects using Redis cache
- 🧹 Background cleanup for expired URLs
- 🛡 Rate limiting on URL creation (Redis-based)
- 📈 Indexed database for fast lookups
- 🧱 Clean separation of API & public routes

---

## 🧠 Architecture Overview

### Request Types

#### 1. API (Control Plane)
```

POST /api/v1/shorten

```
- Validates input
- Generates short code (nanoid)
- Writes to Postgres
- Rate-limited (5 req/min/IP)

#### 2. Public Redirect (Data Plane)
```

GET /:short_code

```
- Redis cache lookup
- Fallback to DB
- Expiry validation
- HTTP 302 redirect

---

## 🧩 Tech Stack

- **Node.js + Express**
- **PostgreSQL** (source of truth)
- **Redis** (cache + rate limiting)
- **nanoid** (short code generation)

---

## 📁 Project Structure

```

src/
├── app.js                 # Express app + public routes
├── server.js              # Server bootstrap + schedulers
├── routes/
│   ├── index.js           # API route aggregator
│   └── url.routes.js      # URL-related APIs
├── controllers/
│   └── url.controller.js
├── jobs/
│   └── cleanupExpiredUrls.js
├── middleware/
│   └── rateLimit.js
├── config/
│   ├── db.js              # Postgres pool
│   └── redis.js           # Redis client
└── utils/
└── base62 / nanoid

````

---

## 🗄 Database Schema

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_expires_at ON urls(expires_at);
````

---

## ⚡ Caching Strategy (Redis)

* Redirects are cached by `short_code`
* TTL matches link expiry (or 24h default)
* Cache miss → DB → cache fill

Result:

* Sub-10ms responses for cached reads

---

## 🛡 Rate Limiting

* Endpoint: `POST /api/v1/shorten`
* Strategy: Fixed window counter
* Limit: **5 requests / minute / IP**
* Backed by Redis TTL counters

---

## 🧹 Cleanup Job

* Runs every 5 minutes
* Deletes expired URLs in batches (default: 1000)
* Safe, non-blocking, observable

---

## 🧪 How to Run

```bash
npm install
npm run dev
```

Make sure:

* Postgres is running
* Redis is running
* `.env` contains DB & Redis credentials

---

## 📌 Learning Goals Covered

* Express routing architecture
* Redis caching patterns
* Rate limiting strategies
* Background job design
* Database indexing
* Event-loop safe design
* Production-minded tradeoffs

---

## 🛠 Possible Next Improvements

* Click analytics
* Custom aliases
* Auth / API keys
* Distributed rate limiting
* CDN-based redirect handling
* Full system design @ scale

---

## 📄 License

MIT
---