import { Item } from "./item";
import { User } from "./user";

export interface Message {
  id: number;
  room: Room;
  roomId: number;
  user: User;
  userId: number;
  delivered: boolean;
  markedSeen: boolean;
  date: Date;
  text: string;
}

export interface Room {
  message: Message;
  users: User;
}
