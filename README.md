
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

### Both teammate: 
Database / QA
Supported data design, testing, and deployment setup

### Motivation
Many college students commute daily, often driving alone, which increases traffic congestion and environmental impact.
CampusPool provides an easy way for students to share rides safely within the same campus community.

### Design
Front-End: 
```
React + Vite
Responsive UI (desktop + mobile)
```
Back-End:
```
Node.js (Express.js)
Abstracted storage layer
Supports Memory Mode & MySQL Mode
```

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

# Database Usage Guide

CampusPool supports two storage modes to help with development & deployment:

*   **Memory Mode**: Stores data in server RAM
    *   **pros**: Fast, no setup
    *   **cons**: Data resets on restart
*   **MySQL Mode**: Stores data persistently in MySQL
    *   **pros**: Real database, persistent
    *   **cons**: Requires MySQL installation

## 2. Configured via .env:

```
STORAGE_MODE=memory   # or mysql
```

### 2.1 Core Option

| Variable | Description | Values | Default |
| :--- | :--- | :--- | :--- |
| `STORAGE_MODE` | Data storage mode | `memory`, `mysql` | `memory` |

### 2.2 MySQL Options (when STORAGE_MODE=mysql)


| Variable | Description | example |
| :--- | :--- | :--- |
| `DB_HOST` | MySQL host | `127.0.0.1` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | Username | `root` |
| `DB_PASSWORD` | Password | `your_password` |
| `DB_NAME` | Database name | `campuspool_db` |
| `DB_CONNECTION_LIMIT`| Pool size | `10` |

## 3. Switching Storage Modes

### 3.1 Switching: Memory → MySQL

1.  **create database:**:
    *   make sure MySQL server start。
    *   login MySQL and create database：
        ```sql
        CREATE DATABASE campuspool_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        ```
    *   **Initialize tables**:
        run：
        `src/backend/database/init.sql`
        (using MySQL Workbench / DBeaver / CLI)

2.  **Edit .env**:
    open `src/backend/.env` file：
    ```ini
    STORAGE_MODE=mysql
    DB_HOST=your database IP
    DB_PORT=3306
    DB_USER=your username
    DB_PASSWORD=your password
    DB_NAME=campuspool_db
    ```

3.  **Restart Backend**:
    ```bash
    # stop current server (Ctrl+C)
    # restart
    npm run dev
    ```
    *if you see "MySQLDataStore initialized", connect success。*

### 3.2 Switching: MySQL → Memory

1.  **Edit .env**:
    open `src/backend/.env` change memory mode to: memory：
    ```ini
    STORAGE_MODE=memory
    ```

2.  **restart backend**:
    ```bash
    npm run dev
    ```
    *If see "Initializing DataStore in 'memory' mode..."，switch success。*

## 4. Clearing / Resetting Data

### 4.1 Memory Mode

Restart the backend → data resets automatically.

### 4.2 MySQL Mode

#### Option A — Reset entire database:

```sql
DROP DATABASE campuspool_db;
CREATE DATABASE campuspool_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- then restart src/backend/database/init.sql
```

#### Option B：Clear tables:

```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE messages;
TRUNCATE TABLE conversations;
TRUNCATE TABLE carpool_requests;
TRUNCATE TABLE user_profiles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
```

## 5. Common Errors & Fixes

*   **Error：`Error: connect ECONNREFUSED`**
    *   MySQL is not running
    *   Wrong DB_HOST / DB_PORT

*   **Error: `ER_BAD_DB_ERROR`**
    *   Database does not exist
    *   → Run CREATE DATABASE campuspool_db

*   **Error：`ER_NO_SUCH_TABLE`**
    *   Forgot to run init.sql

*   **Data not saved?**
    *   You are using memory mode, which resets after restart.


## Future Improvements

Add persistent database (PostgreSQL / MongoDB)

Real-time chat via WebSocket

Route and map integration
  