export interface ChatMessage {
  id: string;
  message: string;
  userId: string;
  nickname: string;
  roomId: string;
  createdAt: string;
}

export interface SystemMessage {
  message: string;
  type: 'info' | 'error' | 'join' | 'leave' | 'create';
}

export interface JoinRoomData {
  roomId: string;
}

export interface LeaveRoomData {
  roomId: string;
}

export interface SendMessageData {
  roomId: string;
  message: string;
}

export interface DeleteMessageData {
  messageId: string;
  roomId: string;
}

export interface GetChatHistoryData {
  roomId: string;
  page?: number;
  limit?: number;
}

export interface MessageDeletedData {
  messageId: string;
}

export interface ErrorData {
  message: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  currentRoomId: string | null;
  error: string | null;
}