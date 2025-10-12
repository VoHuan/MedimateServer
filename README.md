MedimateServer

Backend for Medimate mobile e-commerce app

This repository contains the Node.js/Express backend for the Medimate mobile e-commerce application. It provides REST APIs for products, carts, authentication, users, addresses, orders, coupons, notifications and payment integrations (MoMo, ZaloPay). The project uses Sequelize for MySQL integration and Firebase for push notifications.

## Table of contents

- Features
- Requirements
- Getting started
  - Install
  - Environment variables
  - Database sync
- Run (development / production)
- API route prefixes
- Payments
- Docker (compose)
- Useful files
- Contributing
- License

## Features

- REST API built with Express
- MySQL via Sequelize
- Authentication (JWT + Google Sign-In support)
- OTP / Twilio support for phone verification
- Push notifications via Firebase
- Payment gateway integrations: MoMo and ZaloPay

## Requirements

- Node.js (v16+ recommended)
- MySQL server
- npm (comes with Node.js)

## Getting started

1. Clone the repository

2. Install dependencies

```powershell
npm install
```

3. Create a copy of the example environment file and update values

```powershell
copy .\example.env .\.env
# then open .env and fill in secrets (DB credentials, Firebase service account, Twilio, payment keys, etc.)
```

### Important environment variables

The project includes an `example.env` with the variables used by the app. Key variables you should set in `.env`:

- NODE_ENV - development | production
- PORT - server port (e.g. 8080)

# Database

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

# Google / Auth

- GOOGLE_CLIENT_ID

# Twilio (optional, for OTP)

- TWILIO_SID
- TWILIO_AUTH_TOKEN
- PHONE_NUMBER

# JWT

- ACCESS_SECRECT_STR
- REFRESH_SECRECT_STR
- ACCESS_EXPIRES
- REFRESH_EXPIRES

# MoMo

- MOMO_ACCESS_KEY
- MOMO_SECRECT_KEY
- MOMO_REQ_URL
- MOMO_REQ_CHECK_STATUS_URL

# ZaloPay

- APP_ID
- KEY_1
- KEY_2
- CREATE_END_POINT
- QUERY_END_POINT

Also add Firebase Admin SDK credentials to `firebase-adminsdk.json` (example file is included as `example.firebase-adminsdk.json`).

## Database sync

This project includes a small sync script that initializes Sequelize models and can create tables if needed. When the server starts it calls `src/scripts/sync.js` which will synchronize models with the database. Make sure your MySQL server is reachable and the DB user has appropriate privileges.

## Run

- Development (uses nodemon):

```powershell
npm start
```

- Production (example env variable used in package.json):

```powershell
npm run start_prod
```

Server logs will indicate the port. By default the app reads PORT from environment variables.

## API route prefixes

The app mounts several routers under `/api` — the main route prefixes are:

- /api/product
- /api/cart
- /api/auth
- /api/user
- /api/address
- /api/order
- /api/order-detail
- /api/coupon
- /api/redeemed-coupons
- /api/notification

Inspect the `src/routes` folder for route files and controller methods for each endpoint and expected request/response shapes.

## Payments

This server includes integrations with MoMo and ZaloPay. The example environment includes test keys and endpoints. If you plan to use real transactions, replace test keys and endpoints with production values and review gateway documentation.

Files of interest:

- `src/Payment/MoMo/CreateMomoRequest.js`
- `src/Payment/MoMo/ReceivedMoMoRequest.js`
- `src/Payment/ZaloPay/CreateZalopayRequest.js`
- `src/Payment/ZaloPay/ReceivedZaloPayRequest.js`

## Docker

The repo contains `Dockerfile`, `Dockerfile.database` and `docker-compose.yaml` to help run the service and a database in containers. Before using Docker, ensure `.env` variables are set or passed into the container.

## Useful files and folders

- `src/index.js` — application entrypoint
- `src/routes` — route definitions
- `src/controllers` — request handlers
- `src/models` — Sequelize models
- `src/services` — business logic
- `src/config` — external service configuration (database, firebase)
- `example.env` — example environment variables
- `firebase-adminsdk.json` / `example.firebase-adminsdk.json` — firebase admin credentials

## Frontend (mobile client)

The mobile frontend (client) for Medimate is available on GitHub:

- https://github.com/VoHuan/MedimateClient

Clone or inspect the frontend repository to see how the mobile app interacts with this backend.

## Contributing

## License

This project does not specify a license in `package.json`. Add a LICENSE file if you intend to open-source the code.
