# Crustpilot ⭐️⭐️⭐️⭐️⭐️

## By Team Foodies 🍕

<table>
   <tr>
    <td> <a href="https://github.com/ameerahadisa"> Ameerah </a> </td>
    <td> <a href="https://github.com/alwilson3"> Anna </a> </td>
    <td> <a href="https://github.com/ddanielaiwuyo"> Daniel </a> </td>
    <td> <a href="https://github.com/Hardeep-Kahlon"> Hardeep </a> </td>
    <td> <a href="https://github.com/Jessica-Tslv"> Jessica </a> </td>
    <td> <a href="https://github.com/JonLlo"> Johnny </a> </td>
    <td> <a href="https://github.com/Vedant-2309"> Vedant </a> </td>
   </tr>
</table>

Crustpilot is a full-stack MERN application designed to help teams discover and share great lunch spots.

Users can browse venues added by coworkers, leave ratings, and build a list of favourite places.

### Live Demo: https://foodies-crustpilot.food/

### ✔︎ Features

🔍 **Browse** lunch venues added by coworkers\
⭐ **Rate** and review places\
❤️ **Favourite** venues for quick access\
➕ **Add** new lunch spots\
👤 User authentication (signup/login)\
🧑 Profile management (edit details, bio, password)

## Tech Stack

<table>
  <tr>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eslint/eslint-original.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitest/vitest-original.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongoose/mongoose-original.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="45"/></td>
      <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" width="45"/></td>
   </tr>
</table>

## Structure

The project consists of:

- A frontend React App
- A backend api server

These two applications communicate through HTTP requests, and need to be
run separately.

```bash
.
├── api/ # Express backend (REST API)
├── frontend/ # React frontend (Vite)
├── docs/ # Supporting documentation & diagrams
├── DOCUMENTATION.md
└── README.md
```

#### Backend Highlights (/api)

- Controllers handle logic (authentication, posts, favourites, users)
- Models define MongoDB schemas (User, Post)
- Middleware manages authentication (JWT token checking)
- RESTful routes for API endpoints
- Jest test suite

#### Frontend Highlights (/frontend)

- React + Vite setup
- Component-based architecture
- Pages and services separation
- Routing via React Router
- Vitest + Testing Library for tests

## User Stories

### Authentication

> _As a user, I want to sign up so that I can create an account_\
> _As a user, I want to log in so that I can access my account_\
> _As a user, I want to log out so that I can securely end my session_

### Places

> _As a user, I want to view lunch venues and their ratings so that I can decide where to eat_\
> _As a user, I want to add a new venue so that I can share recommendations_\
> _As a user, I want to rate a venue so that I can share my experience_

### Favourites

> _As a user, I want to favourite a venue so that I can easily find it later_\
> _As a user, I want to view my favourite venues so that I can revisit them_
> _As a user, I want to be able to remove venues from favourites_

### Profile

> _As a user, I want to view my profile so that I can see my activity_\
> _As a user, I want to edit my details so that my information stays up to date_\
> _As a user, I want to add a bio so that others can know more about me_\
> _As a user, I want to be able to change my password to keep my account secure_

## Documentation

Additional documentation and architecture diagrams can be found here:\
➡️ [./DOCUMENTATION.md](./DOCUMENTATION.md)\
➡️ [./docs/](./docs/)

## Project Management

📋 [Trello Board](https://trello.com/b/M05QtzQ4/team-foodies)

# Quickstart

## Set up your project

### 1. Install Node.js

Make sure you have node and NVM installed.

```
brew install nvm
nvm install 18
```

### 2. Clone the Repository

```
git clone https://github.com/alwilson3/team-foodies-crust-pilot.git
cd team-foodies-crust-pilot
```

### 3. Install Dependencies

```
cd frontend && npm install
cd ../api && npm install
```

### 4. Install MongoDB

```
brew tap mongodb/brew
brew install mongodb-community@8.0
brew services start mongodb-community@8.0
```

### 5. Environment Variables

Frontend (frontend/.env)

```
VITE_BACKEND_URL="http://localhost:3000"
```

Backend (api/.env)

```
MONGODB_URL="mongodb://0.0.0.0/acebook"
MONGO_DB_TEST="mongodb://0.0.0.0/crustpilot_test_db"
NODE_ENV="development"
JWT_SECRET="secret"
```

### 6. Seed the Database (Optional but Recommended)

To populate the database with initial data:

```
cd api
node seed.js
```

## Running the App

### 1. Start Backend

```
cd api
npm run dev
```

### 2. Start Frontend

```
cd frontend
npm run dev
```

### 3. Visit:

```
http://localhost:5173/
```

### Testing

#### Backend

```
cd api
npm test
```

#### Frontend

```
cd frontend
npm test
```

## Made it this far? You’ve earned a lunch break!

Why not check out some recommendations on Crustpilot and find your next favourite spot? 🍜
