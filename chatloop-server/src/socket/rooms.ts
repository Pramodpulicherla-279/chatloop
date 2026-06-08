export interface Room {
  roomId: string;
  user1: string;
  user2: string;
}

export const activeRooms = new Map<string, Room>();