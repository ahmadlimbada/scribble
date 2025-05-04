import express from "express";
import cors from "cors";
import * as schedule from "node-schedule";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

const app = express();
const corsOptions = {
  origin: "*", // Frontend URL
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.get("/room/:id", (req, res) => {
  const data = chatService.getRoomDetails(req.params.id);
  res.status(200).json({
    status: 1,
    message: data ? "Room Found Successfully" : "Room not found!",
    data: data ? data : {},
  });
});

// Create an HTTP server
const server = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, { cors: corsOptions });

const chatService = new ChatService();

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Handle Socket.IO connections
io.on("connection", (socket: Socket) => {
  // Handle Join
  socket.on("join", (data: IUser) => {
    console.log("join");
    // Store user data in Object
    chatService.joinRoom(data, socket.id);
    // Join Room
    socket.join(data.room);

    // Get updated room members list
    const roomMembers = chatService.getRoomMembers(data.room);

    // Get current Game state
    const gameState = chatService.getGameState(data.room);

    // Get current Turn User
    const currentTurn = chatService.getCurrentPlayerByRoomId(data.room);

    // Emit the "joined" event to **everyone**, including the user who just joined
    io.to(data.room).emit("joined", {
      user: data,
      members: roomMembers,
      gameState: gameState,
      currentTurn: currentTurn,
    });
  });

  // Handle Typing
  socket.on("typing", (data: ITyping) => {
    console.log("typing");
    socket.broadcast
      .to(data.room)
      .emit("typing", { user: data.user, typing: data.typing });
  });

  // Handle Message
  socket.on("send", (data: ISend) => {
    console.log("send");
    socket.broadcast.to(data.room).emit("receive", {
      user: data.user,
      message: data.message,
    });
  });

  // Handle Game Configurations
  socket.on("update-configuration", (data: IConfiguration) => {
    console.log("update-configuration");
    chatService.updateGameConfiguration(data);
    socket.broadcast.to(data.room).emit("configuration-updated", data);
  });

  socket.on("word-selection", (user: IUser) => {
    console.log("word-selection");
    chatService.updateGameStatus(user.room, "word-selection");

    // chatService.setCurrentRound(user.room);

    // Get current Game state
    const gameState = chatService.getGameState(user.room);
    const roomMembers = chatService.getRoomMembers(user.room);

    io.to(user.room).emit("word-selection", {
      currentTurn: user,
      gameState: gameState,
      roomMembers: roomMembers,
    });
  });

  socket.on("word-selected", (data: IWordSelected) => {
    console.log("word-selected");

    // Update game status and word in your chat service
    chatService.updateGameStatus(data.currentTurn.room, "live");
    chatService.updateGameWord(data.currentTurn.room, data.word);

    // Emit "game-started" event to the room
    io.to(data.currentTurn.room).emit("game-started", data);

    const startTime = Date.now();
    chatService.updateGameStartTime(data.currentTurn.room, startTime);

    // Retrieve the game state to access the drawTime
    const gameState = chatService.getGameState(data.currentTurn.room);

    // Schedule the "leader-board" and "next-round" events based on the drawTime
    if (gameState && gameState.drawTime) {
      const drawTimeInMilliseconds = gameState.drawTime * 1000;
      const leaderBoardTime = startTime + drawTimeInMilliseconds;

      schedule.scheduleJob(leaderBoardTime, () => {
        console.log("leader-board");
        const leaderBoard = chatService.getLeaderBoard(data.currentTurn.room);
        io.to(data.currentTurn.room).emit("leader-board", leaderBoard);
      });

      // Allow next user to select word
      const nextRoundTime = leaderBoardTime + 10 * 1000; // Add 10 seconds
      schedule.scheduleJob(nextRoundTime, () => {
        // const gameState = chatService.getGameState(data.currentTurn.room);
        const isLastPlayer =
          gameState.currentTurn === gameState.players.length - 1;

        if (isLastPlayer) {
          // Last player finished drawing, move to the next round
          if (gameState.currentRound < gameState.rounds) {
            chatService.setCurrentRound(
              data.currentTurn.room,
              gameState.currentRound + 1
            );
          } else {
            // If all rounds are completed, end the game
            chatService.updateGameStatus(data.currentTurn.room, "lobby");
            // Reset currentTurn to the first player (index 0)
            chatService.setCurrentRound(data.currentTurn.room, 0);

            const roomMembers = chatService.getRoomMembers(
              data.currentTurn.room,
              true
            );
            io.to(data.currentTurn.room).emit("result", roomMembers);
            return;
          }
        }
        chatService.updateGameStatus(data.currentTurn.room, "word-selection");
        // Emit the word-selection event for the next player
        io.to(data.currentTurn.room).emit("word-selection", {
          currentTurn: chatService.getNextPlayerByRoomId(data.currentTurn.room),
          gameState: chatService.getGameState(data.currentTurn.room),
          roomMembers: chatService.getRoomMembers(data.currentTurn.room),
        });
      });
    }
  });

  socket.on("drawing", (data) => {
    // Broadcast the drawing data to all other clients
    socket.broadcast.to(data.room).emit("drawing", data);
  });

  socket.on("stop", (data) => {
    // Broadcast the drawing data to all other clients
    socket.broadcast.to(data.room).emit("stop", data);
  });

  socket.on("clear", (room) => {
    // Broadcast the drawing data to all other clients
    socket.broadcast.to(room).emit("clear");
  });

  socket.on("restart", (room) => {
    io.to(room).emit("restart");
  });

  // Handle Word Guessed Message
  socket.on("word-guessed", (user: IUser) => {
    console.log("word-guessed");

    // update leader-board here
    chatService.updateLeaderBoard(socket.id, user);

    socket.broadcast.to(user.room).emit("word-guessed", user);
  });

  socket.on("like", (data: ILike) => {
    console.log("like");
    chatService.updateDrawerScore(data);
    io.to(data.user.room).emit("like", data);
  });

  // Handle Leave
  socket.on("leave", (data: IUser) => {
    console.log("leave");
    // Remove user data in Object
    chatService.leaveRoom(socket.id);
    // Leave Room
    socket.leave(data.room);

    // Get updated room members list
    const roomMembers = chatService.getRoomMembers(data.room);

    // Get current Game state
    const gameState = chatService.getGameState(data.room);

    // Get current Turn User
    const currentTurn = chatService.getCurrentPlayerByRoomId(data.room);

    // Broadcast
    socket.broadcast.to(data.room).emit("left", {
      user: data,
      members: roomMembers,
      gameState: gameState,
      currentTurn: currentTurn,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("disconnect");
    // Get room id before disconnect.
    const data = chatService.getUserByClientId(socket.id);
    // Remove user data in Object
    chatService.leaveRoom(socket.id);

    if (data) {
      // Leave Room
      socket.leave(data.room);

      // Get updated room members list
      const roomMembers = chatService.getRoomMembers(data.room);

      // Get current Game state
      const gameState = chatService.getGameState(data.room);

      // Get current Turn User
      const currentTurn = chatService.getCurrentPlayerByRoomId(data.room);

      // Broadcast
      socket.broadcast.to(data.room).emit("left", {
        user: data,
        members: roomMembers,
        gameState: gameState,
        currentTurn: currentTurn,
      });
    }
  });
});
