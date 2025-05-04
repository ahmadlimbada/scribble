type WORD_MODE = "normal" | "hidden" | "both";
type STATUS = "live" | "lobby" | "word-selection"; // Add leader board and result
interface IUser {
  id: string;
  room: string;
  admin: boolean;
  name: string;
  score: number;
  emoji: string;
}
interface ISend {
  room: string;
  user: IUser;
  message: string;
}

interface ITyping {
  room: string;
  user: IUser;
  typing: boolean;
}

interface IGameState {
  status: STATUS;
  players: string[]; // Array of clientIds
  currentTurn: number;
  word: string;
  startTime: number;
  drawTime: number;
  rounds: number;
  currentRound: number;
  wordMode: WORD_MODE;
  wordCount: number;
  hints: number;
}

interface IConfiguration {
  room: string;
  drawTime: number;
  hints: number;
  rounds: number;
  wordCount: number;
  wordMode: WORD_MODE;
}

interface IWordSelected {
  currentTurn: IUser;
  word: string;
}

interface ILeaderBoard {
  id: string;
  name: string;
  score: number;
  emoji: string;
}

interface ILike {
  isLiked: boolean;
  currentTurn: IUser;
  user: IUser;
}