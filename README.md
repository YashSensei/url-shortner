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
