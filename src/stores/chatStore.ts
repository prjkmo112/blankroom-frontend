import { create } from 'zustand'
import { ChatMessage, SystemMessage, ChatState } from '@/types/chat'
import websocketService from '@/services/websocket'
import { enqueueSnackbar } from 'notistack'

interface ChatStore extends ChatState {
  connect: () => Promise<void>;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: string) => void;
  deleteMessage: (messageId: string, roomId: string) => void;
  getChatHistory: (roomId: string, page?: number, limit?: number) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isConnected: false,
  currentRoomId: null,
  error: null,

  connect: async () => {
    try {
      await websocketService.connect()
      set({ isConnected: true, error: null })

      websocketService.onSystemMessage((data: SystemMessage) => {
        enqueueSnackbar(data.message, {
          variant: data.type === 'error' ? 'error' : 'info'
        })
      })

      websocketService.onNewMessage((data: ChatMessage) => {
        set((state) => ({
          messages: [...state.messages, data]
        }))
      })

      websocketService.onChatHistory((data: ChatMessage[]) => {
        set((state) => {
          const existingIds = new Set(state.messages.map(msg => msg.id))
          const newMessages = data.filter(msg => !existingIds.has(msg.id))

          const allMessages = [...newMessages, ...state.messages]
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

          return { messages: allMessages }
        })
      })

      websocketService.onMessageDeleted((data) => {
        set((state) => ({
          messages: state.messages.filter(msg => msg.id !== data.messageId)
        }))
      })

      websocketService.onError((data) => {
        set({ error: data.message })
        enqueueSnackbar(`채팅 오류: ${data.message}`, { variant: 'error' })
      })

    } catch (error) {
      console.error('WebSocket connection failed:', error)
      set({ isConnected: false, error: 'WebSocket 연결에 실패했습니다.' })
      enqueueSnackbar('채팅 서버 연결에 실패했습니다.', { variant: 'error' })
      throw error
    }
  },

  disconnect: () => {
    websocketService.removeAllListeners()
    websocketService.disconnect()
    set({ isConnected: false, currentRoomId: null, error: null })
  },

  joinRoom: (roomId: string) => {
    if (!get().isConnected)
      throw new Error('WebSocket이 연결되지 않았습니다.')

    websocketService.joinRoom({ roomId })
    set({ currentRoomId: roomId })
  },

  leaveRoom: (roomId: string) => {
    if (!get().isConnected)
      throw new Error('WebSocket이 연결되지 않았습니다.')

    websocketService.leaveRoom({ roomId })

    if (get().currentRoomId === roomId)
      set({ currentRoomId: null })
  },

  sendMessage: (roomId: string, message: string) => {
    if (!get().isConnected)
      throw new Error('WebSocket이 연결되지 않았습니다.')

    if (message.trim().length === 0)
      return

    if (message.length > 1000) {
      enqueueSnackbar('메시지는 1000자를 초과할 수 없습니다.', { variant: 'error' })
      return
    }

    websocketService.sendMessage({ roomId, message: message.trim() })
  },

  deleteMessage: (messageId: string, roomId: string) => {
    if (!get().isConnected)
      throw new Error('WebSocket이 연결되지 않았습니다.')


    websocketService.deleteMessage({ messageId, roomId })
  },

  getChatHistory: (roomId: string, page = 1, limit = 50) => {
    if (!get().isConnected)
      throw new Error('WebSocket이 연결되지 않았습니다.')

    websocketService.getChatHistory({ roomId, page, limit })
  },

  clearMessages: () => {
    set({ messages: [] })
  },

  setError: (error: string | null) => {
    set({ error })
  }
}))