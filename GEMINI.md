# GEMINI Project Context: ARFOUD

## Project Overview

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) project for "ARFOUD," a Moroccan travel and experience booking platform. The application is designed to manage clients (users) and articles (representing travel packages/excursions).

The project is structured as a monorepo with two main directories:
-   `backend/`: A Node.js/Express.js REST API that handles business logic and data persistence.
-   `frontend/`: A React single-page application (SPA) built with Vite that serves as the user interface.

Authentication is handled via JSON Web Tokens (JWT). The backend provides protected endpoints for managing articles, which are associated with the clients who create them. The frontend uses Redux Toolkit for state management, including user authentication status and article data.

## Building and Running

### Backend

The backend is a standard Node.js application.

1.  **Install Dependencies:**
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file in the `backend` directory with the following variables.
    ```
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    PORT=5000
    ```

3.  **Run the Server:**
    There is no `start` script in `package.json`. Run the server directly with Node.
    ```bash
    node server.js
    ```

### Frontend

The frontend is a React application built with Vite.

1.  **Install Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

2.  **Run the Development Server:**
    This command starts the Vite dev server, typically on a port like `5173`.
    ```bash
    npm run dev
    ```
    **Note:** The frontend expects the backend API to be running on `http://localhost:5000`. There is no proxy configured in Vite, so API calls are likely hardcoded to that address.

3.  **Build for Production:**
    ```bash
    npm run build
    ```

4.  **Linting:**
    ```bash
    npm run lint
    ```

## Development Conventions

### Backend

-   **Architecture:** The backend follows a classic **MVC-like (Model-View-Controller)** pattern.
    -   `models/`: Defines Mongoose schemas for database collections (`Article`, `Client`).
    -   `routes/`: Defines API endpoints and maps them to controller functions.
    -   `controllers/`: Contains the core business logic for each endpoint.
    -   `middleware/`: Contains middleware, notably `authMiddleware.js` for protecting routes with JWT.
-   **Authentication:** Routes are protected using a `protect` middleware that verifies a `Bearer` token in the `Authorization` header.
-   **Error Handling:** Uses `express-async-handler` to catch errors in async functions and passes them to a custom error-handling middleware in `server.js`.
-   **Testing:** There are currently **no automated tests** configured for the backend.

### Frontend

-   **Architecture:** The frontend uses a "feature-sliced" pattern.
    -   `pages/`: Contains top-level components that correspond to a page/route (e.g., `Dashboard`, `Login`).
    -   `components/`: Contains reusable, general-purpose UI components (e.g., `Navbar`).
    -   `features/`: Contains Redux "slices," which group state, actions, and async logic for a specific domain (e.g., `auth`, `articles`).
-   **State Management:** Global state is managed with **Redux Toolkit**. The store is configured in `src/app/store.js`.
-   **Routing:** Client-side routing is handled by **React Router (`react-router-dom`)**. Route definitions are in `src/App.jsx`.
-   **API Communication:** API calls are managed within Redux slices using `createAsyncThunk` and likely a service module (e.g., `features/articles/articleService.js`).
