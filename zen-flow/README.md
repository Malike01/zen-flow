# ZenFlow 🧘

> A full-stack, Trello-like Kanban board (MERN Stack) built to showcase senior-level React and Node.js patterns. ZenFlow provides a high-performance, real-time interface for managing tasks, powered by a RESTful API and a MongoDB database.

[Add a screenshot or a short GIF of your project here! A demo of the drag-and-drop feature interacting with the backend is highly effective.]

## ✨ Features

- **Full-Stack MERN Application:** True persistence with a **Node.js/Express/MongoDB** backend.
- **RESTful API:** A complete backend API for all CRUD operations on tasks and columns.
- **Full CRUD Functionality:** Create, edit, and delete tasks and columns with data saved to a database.
- **Drag & Drop:** Smoothly reorder tasks within a column or move them between columns, powered by `@hello-pangea/dnd`.
- **Server State Management:** Uses **React Query (TanStack Query)** for efficient data fetching, caching, and state synchronization, including optimistic updates.
- **Client State Management:** Uses **Zustand** for managing UI-specific state (e.g., open modals, form states).
- **Modal-Based Editing:** Click any task to open an Ant Design `Modal` for detailed editing.

## 🚀 Core Architectural Concepts

This project demonstrates a full-stack architecture, separating concerns between a modern React client and a robust Node.js backend.

### Frontend (Client)

- **💎 Server State Management (React Query)**

  - Instead of managing API data in a global store, this project uses **React Query** (`@tanstack/react-query`) to handle all server state.
  - This provides automatic caching, background re-validation (stale-while-revalidate), and handles `isLoading`/`isError` states out of the box.
  - **Optimistic Updates:** Drag-and-drop actions use optimistic updates for a perceived instant response, updating the UI _before_ the API call completes and rolling back only if an error occurs.

- **🧘 Client State Management (Zustand)**

  - **Zustand** is used _only_ for managing UI-specific client state (e.g., `isTaskModalOpen`, `editingTaskId`). This separates client-side concerns from server-side data.

- **⚡ Performance Optimization (Memoization)**

  - `React.memo` and `useCallback` are used to prevent unnecessary re-renders of `TaskCard` components during drag operations or when unrelated state changes.

- **HTTP Client (`axios`)**
  - All API communication with the backend is handled via `axios`, with a pre-configured instance for base URL and headers.

### Backend (Server)

- **🔧 RESTful API (Node.js & Express.js)**

  - A robust backend built with **Express.js** provides a set of RESTful endpoints (e.g., `GET /api/board`, `POST /api/tasks`, `PUT /api/tasks/move`) to manage all data.
  - Uses `cors` middleware to handle cross-origin requests from the React client.

- **🗃️ Database & ODM (MongoDB & Mongoose)**
  - **MongoDB** is used as the NoSQL database to store board, column, and task data.
  - **Mongoose** is used as the Object Data Modeling (ODM) library to define schemas (`TaskSchema`, `ColumnSchema`) and manage database interactions.

## 🛠️ Tech Stack

| Area             | Technology                                 |
| :--------------- | :----------------------------------------- |
| **Frontend**     | React, TypeScript, Vite, Ant Design (AntD) |
| **Server State** | **React Query (TanStack Query)**           |
| **Client State** | **Zustand**                                |
| **API Client**   | axios                                      |
| **UI**           | @hello-pangea/dnd                          |
| **Backend**      | **Node.js**, **Express.js**                |
| **Database**     | **MongoDB**, **Mongoose**                  |
| **Dev Tools**    | nodemon, cors                              |

## ⚙️ Getting Started

This project is a monorepo containing two separate applications: `/client` and `/server`.

### Prerequisites

- Node.js (v18+)
- MongoDB (A local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) connection string)

### 1. Configure the Backend (Server)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install server dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `/server` directory:
    ```
    PORT=3001
    MONGODB_URI=[Your_MongoDB_Connection_String]
    CLIENT_URL=http://localhost:5173
    ```
4.  Run the backend server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:3001`.

### 2. Configure the Frontend (Client)

1.  In a **new terminal**, navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install client dependencies:
    ```bash
    npm install
    ```
3.  (Optional) Create a `.env.local` file in the `/client` directory if your server is not on port 3001:
    ```
    VITE_API_BASE_URL=http://localhost:3001
    ```
4.  Run the client application:
    ```bash
    npm run dev
    ```
    The React app will be running on `http://localhost:5173`.
