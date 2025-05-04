# 🧠 Scribble Server (Express & Socket.io)

This is the backend server for the scribble game, handling real-time communication, game state management, and player interactions using Express and Socket.io.

🔗 Front-End Repository: Check client folder

---

# 🎨 Scribble Front-End (React & Socket.io)

A real-time multiplayer drawing and guessing game built with React and Socket.io. This project replicates the classic Skribbl.io experience, allowing players to sketch and guess words in a fun, interactive environment.

---

## 🎯 Goal

I wanted to challenge myself by creating a real-time, interactive web application that combines drawing capabilities with multiplayer functionality. This project allowed me to delve deep into WebSocket communications, state management, and real-time data synchronization between clients.

The goal was to create a robust backend that supports real-time multiplayer gameplay, ensuring seamless synchronization between players. Implementing this with Express and Socket.io provided an opportunity to delve deep into WebSocket communications and server-side game logic.

---

## 🚀 Quick Start

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmadlimbada/scribble.git
   cd scribble
   ```

2. Install dependencies in both server and client folder:

   ```bash
   cd server && npm install
   # or
   cd server && yarn install
   ```

   ```bash
   cd client && npm install
   # or
   cd client && yarn install
   ```

3. Start the backend server:

   ```bash
   cd server && npm run dev
   # or
   cd server && yarn dev
   ```

   The backend server will start on `http://localhost:3001` by default.

4. Start the frontend server

   ```bash
   cd client && npm run dev
   # or
   cd client && yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

---

## 📖 Usage

- **Create a Room**: Start a new game session and invite friends.
- **Join a Room**: Enter an existing room code to join a game.
- **Drawing Board**: Use the canvas to draw the given word.
- **Chat**: Guess the word by typing in the chat; correct guesses earn points.
- **Leaderboard**: Track scores and see who's leading the game.
- **Real-Time Communication**: Utilizes Socket.io for bi-directional communication between clients and the server.
- **Game Management**: Handles game rooms, player sessions, drawing events, and chat messages.
- **API Endpoints**: Provides RESTful endpoints for room creation, player management, and game state queries.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m 'Add your feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/YourFeatureName
   ```

5. Open a pull request.

---

## 🛠️ Built With

- [React](https://react.dev/)
- [Socket.io](https://socket.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vite.dev/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📄 License

This project is licensed under the MIT License.
