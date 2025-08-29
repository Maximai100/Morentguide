# Project Overview

This project, "Morent Guide," is a web application for managing apartment rentals. It provides a user-friendly interface for both guests and administrators, enabling personalized landing pages for each booking. The frontend is built with React, TypeScript, and Vite, and it interacts with a Directus backend for data management.

## Key Technologies

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS
*   **Backend:** Directus (headless CMS)
*   **API:** RESTful API via Axios
*   **Deployment:** Vercel, Netlify, Docker, or GitHub Pages

# Building and Running

The project uses `pnpm` as the package manager.

**1. Installation:**

```bash
pnpm install
```

**2. Environment Variables:**

Create a `.env.local` file in the `morent-guide` directory by copying `env.example`. Fill in the required variables, such as `VITE_DIRECTUS_URL` and `VITE_DIRECTUS_TOKEN`.

**3. Development Server:**

To run the application in development mode:

```bash
pnpm dev
```

This will start a local server, typically at `http://localhost:5173`.

**4. Production Build:**

To create a production-ready build:

```bash
pnpm build:prod
```

The output will be in the `morent-guide/dist` directory.

**5. Linting and Type-Checking:**

To check for code quality and type errors:

```bash
pnpm lint
pnpm type-check
```

# Development Conventions

*   **Code Style:** The project uses ESLint to enforce a consistent code style.
*   **Commits:** (No information on commit conventions was found)
*   **API Interaction:** All API requests to the Directus backend are handled through the `src/utils/api.ts` module. This module provides a centralized and consistent way to interact with the API.
*   **Routing:** The application uses `react-router-dom` for routing. The main routes are defined in `src/App.tsx`.
*   **State Management:** (No specific state management library like Redux or MobX was found. State is likely managed with React's built-in hooks.)
*   **Styling:** The project uses Tailwind CSS for styling.
