# URL Shortener – Backend (System Design First)

This project is a backend-focused URL shortener built to **learn backend engineering and system design properly**, without shortcutting via AI-generated code.

The goal is to design and implement the system **step by step**, from architecture → APIs → database → core logic, while understanding *why* each decision is made.

---

## 🚀 Current Features (Completed)

### ✅ Project Setup
- Node.js + Express (ES Modules)
- Clean folder structure (routes, controllers, utils, config)
- Environment-based configuration using `.env`
- PostgreSQL via **NeonDB** (managed Postgres)
- Connection pooling using `pg`

---

### ✅ Database Design
Single table design focused on performance and simplicity:

```sql
urls (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE,
  original_url TEXT NOT NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
)


Design decisions:

expires_at = NULL → permanent URL

short_code stored separately (domain not stored)

Minimal schema to keep read path fast

✅ API Implemented
Create Short URL
POST /api/v1/shorten


Request

{
  "original_url": "https://example.com",
  "expires_at": "2025-12-31T23:59:59Z" // optional
}


Response

{
  "short_url": "http://localhost:3000/b",
  "short_code": "b"
}

✅ Input Validation

original_url

Required

Must be a string

Must start with http:// or https://

expires_at (optional)

Must be a valid date

Must be in the future

Invalid inputs return 400 Bad Request.

✅ Short Code Generation (Core Logic)

Uses Base62 encoding

Deterministic, collision-free

Generated from database id

Flow:

INSERT URL → get id → Base62(id) → UPDATE short_code


This approach:

Avoids collisions

Avoids retries

Scales well

Is industry-standard

✅ Infrastructure & Tooling Lessons

Postman Proxy can block POST requests on localhost

curl / Invoke-RestMethod used as ground truth

Environment variable mismatches can silently break DB connections

NeonDB requires SSL configuration

🧠 Key Engineering Decisions

No authentication (by design, for learning)

Write path optimized for correctness

Read path to be optimized next (redirect + Redis)

No premature optimizations or over-engineering

📁 Project Structure
src/
 ├─ app.js
 ├─ server.js
 ├─ config/
 │   └─ db.js
 ├─ routes/
 │   └─ url.routes.js
 ├─ controllers/
 │   └─ url.controller.js
 └─ utils/
     └─ base62.js



⏭️ Next Steps

Implement redirect flow: GET /:short_code

Add Redis caching for redirects

Handle expiry on redirect

Add cleanup job for expired URLs