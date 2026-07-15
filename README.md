# TaskFlow — Task & Project Management App

A full-stack task and project management application with JWT-secured REST APIs, a Kanban-style board, and role-based project ownership. Built to demonstrate production-style backend architecture (layered services, secured endpoints, containerized deployment) rather than a tutorial CRUD clone.

## Features

- **Authentication** — Register/login with BCrypt-hashed passwords and stateless JWT (HS256) sessions
- **Projects** — Create, update, delete projects; owner and member-based access control
- **Tasks** — Full CRUD on tasks scoped to a project, with status (`TODO` / `IN_PROGRESS` / `DONE`), priority, assignee, and due dates
- **Kanban Board** — Drag-and-drop task cards between status columns, with optimistic UI updates
- **Access Control** — Only project owners can update/delete a project; only owners/members can view or modify its tasks
- **Containerized** — Multi-stage Dockerfiles for both services, orchestrated with `docker-compose`
- **CI/CD** — GitHub Actions pipeline builds and tests both services on every push; optional EC2 deploy workflow included

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data MongoDB |
| Auth | JWT (jjwt), BCrypt password hashing |
| Database | MongoDB |
| Frontend | React 18 (Vite), React Router, Axios |
| Infra | Docker (multi-stage builds), docker-compose, Nginx (frontend serving) |
| CI/CD | GitHub Actions |

## Architecture

```
Controller → Service → Repository (Spring Data MongoDB)
     ↑
JWT Auth Filter → Spring Security Context → CurrentUserProvider
```

- **`JwtAuthFilter`** intercepts every request, validates the bearer token, and populates the Spring Security context.
- **`CurrentUserProvider`** resolves the authenticated user from that context so services can scope every project/task query to the requesting user — no user can read or modify another user's projects.
- **`ProjectService`** enforces ownership rules (only the owner can update/delete; owner + members can view).
- **`TaskService`** delegates access checks to `ProjectService` before touching any task, so task-level security always follows project-level membership.

## Project Structure

```
taskflow/
├── backend/                # Spring Boot API
│   ├── src/main/java/com/taskflow/
│   │   ├── controller/      # REST endpoints
│   │   ├── service/         # Business logic + access control
│   │   ├── repository/      # Spring Data MongoDB repositories
│   │   ├── model/           # User, Project, Task documents
│   │   ├── dto/              # Request/response payloads
│   │   ├── security/         # JWT filter, JWT util, current-user resolution
│   │   ├── config/           # Spring Security configuration
│   │   └── exception/        # Centralized error handling
│   └── Dockerfile
├── frontend/                # React (Vite) SPA
│   ├── src/
│   │   ├── pages/            # Login, Register, Dashboard
│   │   ├── components/       # Navbar, Sidebar, KanbanBoard, TaskCard, TaskModal
│   │   ├── context/           # AuthContext (JWT session state)
│   │   └── api/               # Axios client + endpoint wrappers
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/        # CI + optional CD
```

## Running Locally

### Prerequisites
- Java 17+ and Maven
- Node.js 20+
- MongoDB running locally (or use Docker, see below)

### Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`. Set `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_ORIGIN` as environment variables to override the defaults in `application.properties`.

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Runs on `http://localhost:5173`.

### Everything via Docker
```bash
docker compose up --build
```
This starts MongoDB, the backend, and the frontend together. Frontend will be available at `http://localhost:5173`, backend at `http://localhost:8080`.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Authenticate and receive a JWT |
| GET | `/api/projects` | List projects the user owns or is a member of |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/{id}` | Update a project (owner only) |
| DELETE | `/api/projects/{id}` | Delete a project and its tasks (owner only) |
| GET | `/api/projects/{id}/tasks` | List tasks for a project |
| POST | `/api/projects/{id}/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task |
| PATCH | `/api/tasks/{id}/status` | Update just the task's status (used by drag-and-drop) |
| DELETE | `/api/tasks/{id}` | Delete a task |

All endpoints except `/api/auth/**` require an `Authorization: Bearer <token>` header.

## CI/CD

`.github/workflows/ci.yml` runs on every push/PR to `main`:
1. Builds and tests the Spring Boot backend with Maven
2. Builds the React frontend with Vite
3. Builds both Docker images to confirm they package correctly

`.github/workflows/deploy.yml` is a manually-triggered template for deploying to an EC2 instance over SSH via `docker compose` — wire it to your own host by adding `EC2_HOST`, `EC2_USERNAME`, and `EC2_SSH_KEY` as repository secrets.

## Notes on Design Decisions

- **Stateless JWT auth** instead of sessions — keeps the API horizontally scalable and avoids server-side session storage.
- **MongoDB** was chosen to practice a document-oriented data model (tasks/projects don't need rigid relational joins) as a complement to the SQL work in my other projects.
- **Ownership/membership checks live in the service layer**, not the controller — so the same rules apply consistently whether a request comes from the REST API, a future GraphQL layer, or a scheduled job.
