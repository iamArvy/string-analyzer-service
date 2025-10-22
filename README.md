# String Analyzer Service

The String Analyzer Service is a RESTful API built with NestJS that analyzes and stores string data, computing various string properties such as length, palindrome status, unique character count, and more.

This project was developed as part of the HNG Internship 13 Backend Task — Stage 1 Challenge, demonstrating skills in API design, data modeling, and string analysis.

### Objective

To build a RESTful API that:

- Accepts string input.
- Analyzes the string to compute several properties.
- Stores the results in a database.
- Supports filtering and retrieval based on multiple criteria.
- Provides natural-language query parsing for user-friendly filtering.

## 🛠️ Tech Stack
- NestJS
- Node.js
- Mongo DB
- Typescript
- Mongoose

## 📦 Setup
```bash
git clone https://github.com/iamarvy/string-analyzer-service.git
cd string-analyzer-service
pnpm install
pnpm start:dev
```
## Environment Variables
MONGODB_URI= (uri for the mongo db database)
PORT= (optional Port number to run on, if not provided application defaults to 3000)


## Endpoint
```url
GET http://localhost:3000/strings
POST http://localhost:3000/strings
GET http://localhost:3000/strings/:id
DELETE http://localhost:3000/strings/:id
```

## Responses
### POST /strings

```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

### GET /strings
```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```