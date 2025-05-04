# Scribble

# 🧠 Scribble Server (Express & Socket.io)

This is the backend server for the scribble game, handling real-time communication, game state management, and player interactions using Express and Socket.io.

---

## 🎯 Goal

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

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📄 License

This project is licensed under the MIT License.
