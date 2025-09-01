
# _blog-engine_

A full-stack blog application built from scratch, featuring a modern, decoupled architecture with a React frontend and a Node.js backend API. This project includes user authentication and full CRUD (Create, Read, Update, Delete) functionality for managing posts.

_**ONLY READ IF INTERESTED IN ENTIRELY RUNNING THE APPLICATION LOCALLY ON YOUR DEVICE.**_

## Tech Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend** | React, Vite, TypeScript, React Router, Chakra UI |
| **Backend** | Node.js, Express.js, TypeScript, Prisma (ORM) |
| **Database** | PostgreSQL (run via Docker)                   |
| **API** | REST, JSON, JWT for Authentication            |


## Getting Started

Follow these steps to get your development environment set up and running.

**1. Clone the Repository**

```bash
git clone [your-repository-url]
cd [your-project-folder]
```

**2. Set Up the Backend**
First, navigate to the server directory and install its dependencies.

```bash
cd server
npm install
```

Next, you need to set up your environment variables. Create a new file named `.env` inside the `server` folder by copying the example:

```bash
cp .env.example .env
```

*(If you don't have an `.env.example` file, create a new file `server/.env` and paste the following into it, changing the JWT\_SECRET):*

```env
# server/.env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb"
JWT_SECRET="YOUR_OWN_SUPER_SECRET_RANDOM_STRING_HERE"
```

**3. Set Up the Frontend**
Now, navigate to the client directory and install its dependencies.

```bash
cd ../client
npm install
```

Next, create an environment file for the frontend. Create a new file named `.env` inside the `client` folder.

```env
# client/.env
VITE_API_BASE_URL=http://localhost:3000
```

## Running the Application

You'll need to run the database, backend, and frontend in separate terminals.

**1. Start the Database 💾**

  * In a terminal at the **root** of the project, start the PostgreSQL database with Docker.
    ```bash
    docker compose up -d
    ```

**2. Run Database Migrations ⚙️**

  * Before starting the backend, you must set up the database tables.
  * In a terminal for the **/server** directory, run:
    ```bash
    npx prisma migrate dev
    ```

**3. Start the Backend Server**

  * In a terminal for the **/server** directory, run:
    ```bash
    npm run dev
    ```
  * Your backend API is now running at `http://localhost:3000`.

**4. Start the Frontend Server 🖥️**

  * In a **new** terminal for the **/client** directory, run:
    ```bash
    npm run dev
    ```
  * Your frontend application is now running. Open your browser and go to `http://localhost:5173`.