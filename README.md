
  # College carpool app

## Project Overview

CampusPool is a full-stack carpooling platform designed to connect university students who want to share rides to and from campus. The app helps reduce carbon emissions, save money, and promote community connections among students.
It includes both a React front-end and a Node.js (Express) back-end with JWT-based authentication and RESTful APIs.
  
## our teammate:
### Araceli：
Front-End Developer
Designed and implemented the React interface, routing, and component logic

### Ellie Hong:
Back-End Developer
Implemented the Express.js API, tested endpoints, and integrated authentication

Both teammate: Database / QA
Supported data design, testing, and deployment setup

### Motivation
Many college students commute daily, often driving alone, which increases traffic congestion and environmental impact.
CampusPool provides an easy way for students to share rides safely within the same campus community.

### Design
Front-End: React with responsive UI for desktop and mobile
Back-End: Node.js (Express.js) using in-memory data for rapid prototyping
Authentication: JSON Web Tokens (JWT)
Communication: RESTful APIs connecting the front-end and back-end

### Repo Structure
``` CampusPool/
│
├── src/
│   ├── frontend/           # React front-end code
│   ├── backend/            # Express.js backend (server.js, dataStore.js)
│   └── tests/              # Pytest / API test scripts (optional)
│
├── README.md               # Project documentation
└── package.json            # Main dependency configuration
```

## Installation & Setup
Prerequisites
Node.js 16+
npm

## Running the code
  Clone the repository
git clone https://github.com/xinyujieHong/CSEN174_Project.git
cd `CSEN174_Project`

## Start the backend
### 1. Install Dependencies

```bash
cd src/backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set your JWT_SECRET
```

### 3. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3001` by default.


## Start the frontend
Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

The frontend will run on `http://localhost:3000` by default.


## Future Improvements

Add persistent database (PostgreSQL / MongoDB)

Real-time chat via WebSocket

Route and map integration
  