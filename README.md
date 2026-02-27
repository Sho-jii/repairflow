# RepairFlow

A modern, responsive web application built with React, Vite, and Tailwind CSS. RepairFlow provides a clean and intuitive user interface using customized Radix UI components (shadcn/ui), smooth animations with Framer Motion, and robust state management.

## Tech Stack

- **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI primitives](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Dates**: [date-fns](https://date-fns.org/)

## Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (v8 or newer recommended)

## Installation

1. **Clone the repository** (or download the source):
   ```bash
   git clone <your-repo-url>
   cd repairflow
   ```

2. **Install dependencies** using pnpm:
   ```bash
   pnpm install
   ```

## Development

To start the local development server with Hot Module Replacement (HMR):

```bash
pnpm dev
```
The app will be available at `http://localhost:5173` (or the port specified in your terminal).

## Building for Production

To create an optimized production build:

```bash
pnpm run build
```
The built files will be generated in the `dist` directory.

To preview the production build locally:

```bash
pnpm preview
```

## Project Structure

- `src/` - Main source code directory
  - `components/` - Reusable UI components
  - `styles/` - Global styles and Tailwind configuration
  - `main.tsx` - Application entry point
- `public/` - Static assets served at the root path
- `index.html` - Main HTML template
- `vite.config.ts` - Vite configuration