# Issue Tracker

A full-stack issue tracking system built with Python FastAPI backend and Angular frontend.

## Features
- Backend: REST API with CRUD operations, search, filters, sorting, pagination
- Frontend: Responsive UI with data table, modal forms, and real-time filtering
- Data Management: Auto-generated IDs and timestamps, in-memory storage


## Quick Start

### Backend Setup (http://localhost:8000)

1. Navigate to backend directory:
    cd backend

2. Install dependencies:
    pip install fastapi uvicorn

3. Run the server:
    cd app
    python main.py

## Frontend Setup (http://localhost:4200)
1. Navigate to frontend directory:
    cd frontend/issue-tracker-frontend
2. Install dependencies:
    npm install
3. Start the development server:
    ng serve
4. Open http://localhost:4200 in your browser

## API Endpoints
Method->Endpoint->Description
GET-> /health-> Health check
GET-> /issues->	Get issues (supports search/filters/sort/pagination)
GET-> /issues/{id}-> Get single issue
POST-> /issues-> Create new issue
PUT-> /issues/{id}-> Update issue

## Usage
- View Issues: Table with sorting, pagination, and filters
- Search: Real-time title search
- Create Issue: Modal form with validation
- Edit Issue: Inline editing or detail view
- Filters: Status, priority, assignee

## Requirements Checklist
### Backend
- GET /health
- GET /issues (search/filters/sort/pagination)
- GET /issues/:id
- POST /issues (auto-generates id/timestamps)
- PUT /issues/:id (updates timestamp)

### Frontend
- Issues table with all required columns
- Search, filters, sorting, pagination
- Create/Edit issue functionality
- Issue detail view with JSON display

### Tech Stack
- Backend: FastAPI, Python, Pydantic
- Frontend: Angular, TypeScript, Bootstrap 5
- Storage: In-memory (demo purposes)