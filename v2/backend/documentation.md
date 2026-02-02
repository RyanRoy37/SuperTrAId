# SuperTrade Backend Documentation

## Architecture
- Clean, modular structure (see folders)
- Express.js REST API
- PostgreSQL for authentication (users table)
- MongoDB for extended user profiles, portfolios, transactions, etc.
- JWT authentication
- Cron jobs for data updates

## APIs
- `/api/auth/signup` – Register user
- `/api/auth/login` – Login user
- Protected routes require JWT

## Data Models
- PostgreSQL: users
- MongoDB: user_profiles, portfolios, transactions, activity_logs, superbundles, etc.

## Cron Jobs
- Hourly price update
- Backfill historical data
- Intraday data fetch

## How to Run
1. Install dependencies: `npm install`
2. Set up `.env` for DB credentials
3. Start server: `npm start`

---

See subfolder documentation for details.
