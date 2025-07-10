# Type Recorder

A dockerized application with React TypeScript frontend and Ruby on Rails backend that records and replays typing sessions.

## Features

- **Write Page**: Record keystrokes as you type answers to questions
- **Replay Page**: Playback recorded typing sessions with forward/rewind controls
- **Real-time Recording**: Captures every keystroke with timestamps
- **User Management**: Username-based session identification
- **Database Storage**: PostgreSQL backend with questions and replayable answers

## Quick Start

1. **Start the application**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

3. **Initialize the database** (first time only):
   ```bash
   docker-compose exec backend rails db:seed
   ```

## Application Structure

```
type-recorder/
├── backend/          # Rails API backend
│   ├── app/
│   │   ├── models/
│   │   └── controllers/
│   ├── db/
│   │   └── migrate/
│   └── Dockerfile
├── frontend/         # React TypeScript frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── types/
│   └── Dockerfile
└── docker-compose.yml
```

## Database Schema

### Questions Table
- `id` (primary key)
- `content` (text)
- `created_at`, `updated_at`

### Replayable Answers Table
- `id` (primary key)
- `username` (string)
- `uuid` (string, unique)
- `question_id` (foreign key)
- `recording_data` (json)
- `created_at`, `updated_at`

## API Endpoints

### Questions
- `GET /api/v1/questions` - List all questions
- `GET /api/v1/questions/:id` - Get specific question

### Replayable Answers
- `GET /api/v1/replayable_answers` - List all recordings
- `GET /api/v1/replayable_answers/:uuid` - Get specific recording
- `POST /api/v1/replayable_answers` - Create new recording

## Development

The application uses bind mounts for hot reloading:
- Backend changes are reflected immediately
- Frontend changes trigger automatic rebuilds

## Usage

1. **Writing**: Navigate to the Write page, enter your username, and start typing your answer. The application records every keystroke with timestamps.

2. **Replaying**: Go to the Replay page, select a recording, and use the playback controls to replay the typing session at different speeds.

## Docker Services

- `db`: PostgreSQL database
- `backend`: Rails API server (port 3001)
- `frontend`: React development server (port 3000)