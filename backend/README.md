# Audit CAR Portal — Backend API

Node.js / Express REST API for the Audit Corrective Action Request (CAR) Portal.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env          # Edit with your SMTP and JWT settings
npm run dev                   # Development (nodemon)
npm start                     # Production
```

## API Endpoints

### Auth
| Method | Endpoint           | Access       | Description          |
|--------|--------------------|--------------|----------------------|
| POST   | /api/auth/login    | Public       | Login, get JWT token |
| GET    | /api/auth/me       | Authenticated| Current user profile |

### Observations
| Method | Endpoint                                              | Access            |
|--------|-------------------------------------------------------|-------------------|
| GET    | /api/observations                                     | All (RBAC filtered) |
| GET    | /api/observations/dashboard/stats                     | All (RBAC filtered) |
| GET    | /api/observations/:id                                 | All (RBAC filtered) |
| POST   | /api/observations                                     | Audit Team only   |
| PUT    | /api/observations/:id                                 | Audit Team only   |
| PATCH  | /api/observations/:id/close                           | Audit Team only   |
| POST   | /api/observations/:id/action-items/:aiId/follow-up    | Authenticated     |
| POST   | /api/observations/:id/action-items/:aiId/revise-date  | Authenticated     |
| PATCH  | /api/observations/:id/action-items/:aiId              | RP / Audit Team   |

### Upload
| Method | Endpoint             | Access         |
|--------|----------------------|----------------|
| POST   | /api/upload          | Audit Team only|
| GET    | /api/upload/history  | Audit Team only|
| GET    | /api/upload/template | Authenticated  |

### Users
| Method | Endpoint       | Access            |
|--------|----------------|-------------------|
| GET    | /api/users     | All (RBAC filtered) |
| GET    | /api/users/:id | All (RBAC filtered) |

## Email Notification Schedule

| Trigger                          | Recipients                     |
|----------------------------------|-------------------------------|
| 15 days before due date (T-15)   | Responsible Person             |
| On due date (T-0)                | Responsible Person             |
| 25th of every month (overdue)    | Responsible Person + HoD       |
| On observation publish           | All assigned Responsible Persons |

## RBAC Roles

| Role               | Capabilities                                              |
|--------------------|----------------------------------------------------------|
| Audit Team         | Full CRUD, upload, confirm closure, view all             |
| HoD                | View observations in own division, escalation dashboard  |
| Responsible Person | View & update own assigned action items only             |
