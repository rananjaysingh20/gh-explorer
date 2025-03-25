# GitHub Dashboard - Frontend Assignment

## 📌 Project Overview
This is a **multi-page GitHub Dashboard** built with **React and TypeScript**, allowing users to:
- Search for GitHub repositories.
- View repository details.
- Explore user profiles.
- Track issues using a Kanban board.

## 🚀 Tech Stack
- **React + TypeScript** → Core framework and language.
- **Vite** → Project bundler for fast development.
- **TanStack Query** → API data fetching, caching, and state synchronization.
- **Redux Toolkit (RTK Query)** → Global state management for issues and repositories.
- **React Router** → Routing setup for navigation.
- **SCSS** → Styling for UI components.
- **GitHub REST API** → Fetches public GitHub data.

## 🎯 Features
### 🔍 Repository Search
- Users can search for GitHub repositories.
- Paginated results with filters to refine searches.

### 📂 Repository Details
- Displays repository information: **stars, forks, languages, and contributors**.
- Option to navigate to the **issues tracking page**.

### 👤 User Profile
- Displays user details, **top-starred repositories, followers, and recent commits**.

### 🏗️ Issues Kanban Board
- Lists repository issues categorized as:
  - **To Do** (open issues).
  - **Done** (closed issues).
- Toggle between **list view** and **kanban view**.
- State management handled using **Redux Toolkit**.

## 🛠️ Setup Instructions
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/github-dashboard.git
cd github-dashboard
```
### 2️⃣ Install Dependencies
```sh
npm install
```
### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add your GitHub API token:
```env
VITE_GITHUB_API_TOKEN=your_github_personal_access_token
```
### 4️⃣ Start the Development Server
```sh
npm run dev
```
The application will be available at `http://localhost:5173/`.

## 📂 Project Structure
```
.github-dashboard/
│── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── services/          # API calls using TanStack Query
│   ├── store/             # Redux state management
│   ├── styles/            # SCSS styles
│   ├── App.tsx            # Main application file
│   ├── main.tsx           # Entry point
│── public/                # Static assets
│── .env                   # Environment variables
│── vite.config.ts         # Vite configuration
│── package.json           # Dependencies and scripts
│── README.md              # Project documentation
```

## 📌 Key Decisions & Best Practices
- **TanStack Query**: Used for efficient data fetching and caching.
- **Redux Toolkit**: Manages issues and repositories in global state.
- **React Router**: Handles page navigation.
- **SCSS Modules**: Ensures modular and maintainable styling.

## 🎯 Future Improvements
- Implement **drag-and-drop** for Kanban board.
- Add **dark mode** support.
- Improve **error handling** for API failures.

## 👨‍💻 Author
Developed by **Rananjay Singh**