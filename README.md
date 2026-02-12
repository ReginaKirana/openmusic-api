# 🎵 OpenMusic API v2

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

> Backend service for the **OpenMusic** application, built to manage music albums, songs, and user playlists with a robust architecture.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Migrations](#-database-migrations)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)

---

## 📖 Overview

**OpenMusic API v2** is a RESTful API designed to support the OpenMusic application functionality. It handles data management for albums, songs, users, and playlists, ensuring secure authentication and authorization using JWT (JSON Web Tokens). The project is built using **Node.js** and **Express**, with **PostgreSQL** as the persistent database.

---

## ✨ Features

The API provides the following core capabilities:

*   **📚 Albums Management**: Create, read, update, and delete music albums.
*   **🎵 Songs Management**: Manage song data including titles, performers, genres, and duration.
*   **👥 User Management**: User registration and profile management.
*   **🔐 Authentication**: Secure login and logout mechanisms using **Refresh Tokens** and **Access Tokens**.
*   **📃 Playlists**: Users can create playlists and add their favorite songs.
*   **🤝 Collaborations**: Share playlists with other users.
*   **🔍 Search**: Find songs and albums easily.

---

## 🛠 Tech Stack

*   **Runtime Environment**: [Node.js](https://nodejs.org/)
*   **Web Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Authentication**: [JSON Web Token (JWT)](https://jwt.io/)
*   **Validation**: [Joi](https://joi.dev/)
*   **Linting**: [ESLint](https://eslint.org/)
*   **Migration Tool**: [node-pg-migrate](https://salsita.github.io/node-pg-migrate/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   **Node.js** (v14 or higher recommended)
*   **npm** (usually comes with Node.js)
*   **PostgreSQL** (running and accessible)

---

## 🚀 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ReginaKirana/openmusic-api-v2.git
    cd openmusic-api-v2
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

---

## ⚙️ Configuration

Create a `.env` file in the root directory of the project. You can copy the structure below and fill it with your local configuration:

```env
# Server Configuration
HOST=localhost
PORT=5000

# PostgreSQL Configuration
PGUSER=your_postgres_user
PGHOST=localhost
PGPASSWORD=your_postgres_password
PGDATABASE=openmusic
PGPORT=5432

# JWT Configuration
ACCESS_TOKEN_KEY=your_secret_access_token_key
REFRESH_TOKEN_KEY=your_secret_refresh_token_key
ACCESS_TOKEN_AGE=1800
```

> **Note:** Make sure to create the database `openmusic` in your PostgreSQL instance before running migrations.

---

## 🗄 Database Migrations

This project uses `node-pg-migrate` to manage database schema changes.

1.  **Run migrations:**
    ```bash
    npm run migrate up
    ```

    This command will create the necessary tables in your `openmusic` database.

---

## ▶️ Running the App

You can run the application in development or production mode.

*   **Development Mode** (using `nodemon` for hot-reloading):
    ```bash
    npm run dev
    ```

*   **Production Mode**:
    ```bash
    npm start
    ```

The server will start at `http://localhost:5000` (or whatever port you defined in `.env`).

---

## 🏗 Project Structure

```
.
├── migrations/         # Database migration files
├── src/
│   ├── api/            # Route handlers and plugins
│   ├── commons/        # Shared utilities, exceptions, and middlewares
│   ├── services/       # Business logic (PostgreSQL services)
│   ├── validator/      # Joi validation schemas
│   └── server.js       # Entry point of the application
├── .env                # Environment variables
├── eslint.config.js      # ESLint configuration
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Created with ❤️ by **Regina**
