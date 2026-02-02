# Auth Controller Documentation

Handles authentication logic:
- Signup: Validates, hashes password, stores in PostgreSQL, profile in MongoDB
- Login: Validates, checks password, returns JWT

Uses services for DB operations and utilities for hashing/JWT.
