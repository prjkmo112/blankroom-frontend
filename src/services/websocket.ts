import { io, Socket } from 'socket.io-client'
import {
  ChatMessage,
  SystemMessage,
  JoinRoomData,
  LeaveRoomData,
  SendMessageData,
  DeleteMessageData,
  GetChatHistoryData,
  MessageDeletedData,
  ErrorData
} from '@/types/chat'

class WebSocketService {
  private socket: Socket | null = null

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(`${import.meta.env.VITE_REST_API_URL}/chat`, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      })

      this.socket.on('connect', () => {
        console.log('WebSocket connected')
        resolve()
      })

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error)
        reject(error)
      })

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected')
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  joinRoom(data: JoinRoomData): void {
    if (!this.socket)
      throw new Error('Socket not connected')
    this.socket.emit('joinRoom', data)
  }

  leaveRoom(data: LeaveRoomData): void {
    if (!this.socket)
      throw new Error('Socket not connected')

    this.socket.emit('leaveRoom', data)
  }

  sendMessage(data: SendMessageData): void {
    if (!this.socket)
      throw new Error('Socket not connected')

    this.socket.emit('sendMessage', data)
  }

  deleteMessage(data: DeleteMessageData): void {
    if (!this.socket)
      throw new Error('Socket not connected')

    this.socket.emit('deleteMessage', data)
  }

  getChatHistory(data: GetChatHistoryData): void {
    if (!this.socket)
      throw new Error('Socket not connected')

    this.socket.emit('getChatHistory', data)
  }

  onSystemMessage(callback: (data: SystemMessage) => void): void {
    if (!this.socket) return
    this.socket.on('systemMessage', callback)
  }

  onNewMessage(callback: (data: ChatMessage) => void): void {
    if (!this.socket) return
    this.socket.on('newMessage', callback)
  }

  onChatHistory(callback: (data: ChatMessage[]) => void): void {
    if (!this.socket) return
    this.socket.on('chatHistory', callback)
  }

  onMessageDeleted(callback: (data: MessageDeletedData) => void): void {
    if (!this.socket) return
    this.socket.on('messageDeleted', callback)
  }

  onError(callback: (data: ErrorData) => void): void {
    if (!this.socket) return
    this.socket.on('error', callback)
  }

  offSystemMessage(callback?: (data: SystemMessage) => void): void {
    if (!this.socket) return
    this.socket.off('systemMessage', callback)
  }

  offNewMessage(callback?: (data: ChatMessage) => void): void {
    if (!this.socket) return
    this.socket.off('newMessage', callback)
  }

  offChatHistory(callback?: (data: ChatMessage[]) => void): void {
    if (!this.socket) return
    this.socket.off('chatHistory', callback)
  }

  offMessageDeleted(callback?: (data: MessageDeletedData) => void): void {
    if (!this.socket) return
    this.socket.off('messageDeleted', callback)
  }

  offError(callback?: (data: ErrorData) => void): void {
    if (!this.socket) return
    this.socket.off('error', callback)
  }

  removeAllListeners(): void {
    if (!this.socket) return
    this.socket.removeAllListeners()
  }
}

export const websocketService = new WebSocketService()
export default websocketService