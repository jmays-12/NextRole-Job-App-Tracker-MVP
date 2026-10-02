# NextRole Job Application Tracker (MVP)

A full-stack job application tracker. Sign up, log in, and keep track of the jobs you've applied to and where each one stands.

**Status:** Minimum viable product

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Flask
- **Database:** SQLite
- **Auth:** Session-based (Flask sessions)

## Features

- Sign up, log in, and log out
- Stay logged in after a page refresh
- Add, view, edit, and delete job applications
- Update an application's status (applied, interview, offer, rejected)
- Add notes to an application
- Each user only sees their own applications

## Data Models

- **users**: id, email, password_hash
- **applications**: id, user_id, company, role, status, notes (each application belongs to one user)

## Getting Started

### 1. Backend

```bash
  cd server
  python -m venv .venv
  source .venv/bin/activate        # Windows: .venv\Scripts\activate
  pip install -r requirements.txt
  cp .env.example .env             # then edit .env and set SECRET_KEY
  python app.py
```

The server runs on http://localhost:5001.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs on http://localhost:5173. Vite proxies `/api` requests to the Flask server.

## Project Structure

```
server/
├── app.py            # Flask routes (auth + applications)
├── models.py         # Database helpers and table setup
└── requirements.txt
client/src/
├── App.jsx           # Shows Auth or Dashboard based on login state
├── Auth.jsx          # Login / signup form
├── Dashboard.jsx     # Application list, add, edit, delete
├── api.js            # All fetch calls to the backend
└── utils/theme.js    # All Tailwind classes live here
```

## Known Issues and Placeholders

- Styling is placeholder only. All classes are in `client/src/utils/theme.js`, so restyling happens in one place.
- No password rules or email validation beyond "required".
- No filtering or sorting of applications yet.
- Not deployed currently. Runs locally only.