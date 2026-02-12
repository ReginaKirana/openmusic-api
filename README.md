# 🎵 OpenMusic API v3

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

> Backend service for the **OpenMusic** application, built to manage music albums, songs, and user playlists with a robust architecture. Version 3 brings advanced features like message queues, caching, and file uploads.

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

**OpenMusic API v3** is a RESTful API designed to support the OpenMusic application functionality. It handles data management for albums, songs, users, and playlists, ensuring secure authentication and authorization using JWT. The project is built using **Node.js** and **Express**, with **PostgreSQL** as the persistent database, **Redis** for caching, and **RabbitMQ** for asynchronous tasks (exporting playlists).

---

## ✨ Features

The API provides the following core capabilities:

*   **📚 Albums Management**: Create, read, update, and delete music albums.
*   **🖼️ Album Covers**: Upload and serve album cover images.
*   **👍 Album Likes**: Like/Unlike albums with real-time caching for like counts.
*   **🎵 Songs Management**: Manage song data including titles, performers, genres, and duration.
*   **👥 User Management**: User registration and profile management.
*   **🔐 Authentication**: Secure login and logout mechanisms using **Refresh Tokens** and **Access Tokens**.
*   **📃 Playlists**: Users can create playlists and add their favorite songs.
*   **📤 Export Playlists**: Export playlist content to email using message queues.
*   **🤝 Collaborations**: Share playlists with other users.
*   **🔍 Search**: Find songs and albums easily.

---

## 🛠 Tech Stack

*   **Runtime Environment**: [Node.js](https://nodejs.org/)
*   **Web Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Caching**: [Redis](https://redis.io/)
*   **Message Broker**: [RabbitMQ](https://www.rabbitmq.com/)
*   **Authentication**: [JSON Web Token (JWT)](https://jwt.io/)
*   **Validation**: [Joi](https://joi.dev/)
*   **Linting**: [ESLint](https://eslint.org/)
*   **Migration Tool**: [node-pg-migrate](https://salsita.github.io/node-pg-migrate/)
*   **Email**: [Nodemailer](https://nodemailer.com/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   **Node.js** (v14 or higher recommended)
*   **npm** (usually comes with Node.js)
*   **PostgreSQL** (running and accessible)
*   **Redis** (running and accessible)
*   **RabbitMQ** (running and accessible)

---

## 🚀 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ReginaKirana/openmusic-api-v2.git
    cd openmusic-api-v2
    ```

2.  **Install dependencies for Main API:**
    ```bash
    npm install
    ```

3.  **Install dependencies for Consumer:**
    ```bash
    cd consumer
    npm install
    cd ..
    ```

---

## ⚙️ Configuration

Create a `.env` file in the **root directory** and the **consumer directory**. You can copy the structure below and fill it with your local configuration:

```env
# Server Configuration
HOST=localhost
PORT=5002

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

# RabbitMQ Configuration
RABBITMQ_SERVER=amqp://localhost

# Redis Configuration
REDIS_SERVER=localhost

# SMTP Configuration (for Email Export)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=user
SMTP_PASSWORD=password
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

You need to run both the Main API Server and the Queue Consumer.

1.  **Start the Main API Server:**
    ```bash
    npm start
    ```
    The server will start at `http://localhost:5002` (or configured port).

2.  **Start the Queue Consumer (for Exports):**
    Open a new terminal window:
    ```bash
    cd consumer
    npm start
    ```

---

## 🏗 Project Structure

```
.
├── consumer/           # Consumer application for queue processing
│   ├── src/
│   │   ├── consumer.js     # Entry point for consumer
│   │   ├── Listener.js     # Message listener
│   │   ├── MailSender.js   # Email sending logic
│   │   └── PlaylistsService.js # Data retrieval for exports
│   └── package.json
├── migrations/         # Database migration files
├── src/
│   ├── api/            # Route handlers and plugins
│   │   ├── albums/
│   │   ├── authentications/
│   │   ├── collaborations/
│   │   ├── exports/    # Export API (Producer)
│   │   ├── playlists/
│   │   ├── songs/
│   │   └── users/
│   ├── commons/        # Shared utilities, exceptions, and middlewares
│   ├── services/       # Business logic
│   │   ├── postgres/   # Postgres Services
│   │   ├── rabbitmq/   # RabbitMQ Producer Service
│   │   ├── redis/      # Redis Cache Service
│   │   └── storage/    # Local Storage Service
│   ├── validator/      # Joi validation schemas
│   └── server.js       # Entry point of the application
├── .env                # Environment variables
├── eslint.config.js    # ESLint configuration
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
