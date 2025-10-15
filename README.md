# CEAT Mixer RMS Frontend

This is the frontend dashboard for the CEAT Mixing SCADA RMS project. It is built using React and Vite, providing a fast development environment with hot module replacement (HMR) and ESLint integration.

## Project Information

- **Project:** CEAT Mixing SCADA RMS Dashboard
- **Purpose:** Visualize and manage recipes, materials, and data for the CEAT mixing process.
- **Tech Stack:** React, Vite, JavaScript, CSS
- **Main Features:**
  - Recipe management (add, delete, view)
  - Material management
  - Data clearing functionality
  - Responsive navigation and footer components

## Folder Structure

- `src/Components/` – Reusable UI components (Navbar, Footer, ClearDataFunction)
- `src/Pages/` – Main application pages (RecipePage, AddRecipe, DeleteRecipe, MaterialManagement)
- `src/data/` – Static data files
- `src/images/` – Image assets

## Getting Started

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
