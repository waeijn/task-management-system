# Task Management System

A minimalist, high-performance task management dashboard designed with a focus on clean UI/UX, fast interactions, and zero clutter. Built with a React frontend and a Laravel 11 backend, fully containerized using Docker for seamless development and deployment.

## Features

- **Minimalist Dashboard**: A beautiful, Figma-inspired UI with high whitespace-to-content ratio and muted typography.
- **Task Organization**: Categorize tasks (Work, Personal, Health, School) and set priorities (Low, Medium, High).
- **Flexible Views**: Toggle seamlessly between Grid and List views to manage your workflow your way.
- **Advanced Filtering**: Instantly filter tasks by status, category, priority, or search by text directly from the dashboard.
- **Dark Mode**: A dedicated pure-CSS dark theme toggle (`#0B0F19` deep matte slate) that updates the entire application globally.
- **Profile & Settings**: Clean, dedicated views for managing user identity and interface preferences.
- **Robust API**: RESTful Laravel backend handling complex filtering, validations, and real-time dashboard summary metrics.

## Tech Stack

- **Frontend**: React (Create React App), React Router, Custom CSS (Figma/Behance trending aesthetic)
- **Backend**: Laravel 11, PHP 8.x, SQLite/MySQL
- **Infrastructure**: Docker & Docker Compose (Optimized for Windows I/O with native named volumes)

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/waeijn/task-management-system.git
   cd task-management-system
   ```

2. **Start the Docker containers**
   The project uses two main containers: `react-dev` (Frontend) and `php-app` (Backend).
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup**
   Run the database migrations and seed the database with initial data:
   ```bash
   docker-compose exec php-app php artisan migrate --seed
   ```

4. **Access the Application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8082/api](http://localhost:8082/api)

## Project Structure

- `/frontend` - Contains the React SPA, components, and CSS styles.
  - `/src/components` - Core UI components (`TaskList`, `Sidebar`, `Profile`, `Settings`, etc.)
- `/backend` - Contains the Laravel API, migrations, and controllers.
  - `/src/app/Http/Controllers` - API Logic (`TaskController`)
  - `/src/database` - Migrations and factories

## UI/UX Philosophy
This system was built to reduce cognitive load. We intentionally stripped away emojis, loud banners, and dense text in favor of crisp SVG icons, subtle color dots, logical key-value row layouts, and segmented controls.

## License
This project is open-source and available under the [MIT License](LICENSE).
