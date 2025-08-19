import { ActionIcon, Avatar, Textarea } from '@mantine/core'
import { IconSend2 } from '@tabler/icons-react'
import React, { useState, useEffect, useRef } from 'react'
import { useChatStore } from '@/stores/chatStore'

interface ChatMessageProps {
  roomId: string;
  containerWidth?: string;
  containerHeight?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ roomId, containerWidth, containerHeight }) => {
  const [messageInput, setMessageInput] = useState('')
  const { messages, sendMessage } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (messageInput.trim() && roomId) {
      sendMessage(roomId, messageInput)
      setMessageInput('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    })
  }

  const shouldShowDateDivider = (currentIndex: number) => {
    if (currentIndex === 0) return true

    const currentDate = new Date(messages[currentIndex].createdAt)
    const prevDate = new Date(messages[currentIndex - 1].createdAt)

    return currentDate.toDateString() !== prevDate.toDateString()
  }

  const shouldShowUserInfo = (currentIndex: number) => {
    if (currentIndex === 0) return true

    const currentMsg = messages[currentIndex]
    const prevMsg = messages[currentIndex - 1]

    if (currentMsg.nickname !== prevMsg.nickname) return true

    const timeDiff = new Date(currentMsg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime()
    return timeDiff > 5 * 60 * 1000
  }

  return (
    <div
      className="max-w-md mx-auto bg-white shadow-lg h-screen flex flex-col"
      style={{ width: containerWidth, height: containerHeight || "100%" }}
    >
      <div className="overflow-y-auto space-y-1 p-4 bg-gray-50 flex-1">
        {messages.map((msg, index) => (
          <div key={msg.id}>
            {shouldShowDateDivider(index) && (
              <div className="flex items-center justify-center py-4">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm text-gray-600 font-medium">
                  {formatDate(msg.createdAt)}
                </div>
              </div>
            )}

            <div className={`flex items-start space-x-3 ${shouldShowUserInfo(index) ? 'mt-4' : 'mt-1'}`}>
              <div className={`flex-shrink-0 ${shouldShowUserInfo(index) ? 'opacity-100' : 'opacity-0'}`}>
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.nickname)}&color=000`}
                  className='w-10 h-10 rounded-full object-cover border-2 border-white shadow-md'
                />
              </div>

              <div className="flex-1 min-w-0">
                {shouldShowUserInfo(index) && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">
                      {msg.nickname}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                )}

                <div className="group relative">
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </div>

                  {!shouldShowUserInfo(index) && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 ml-1">
                      <span className="text-xs text-gray-400">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <Textarea
          placeholder="메시지를 입력하세요..."
          autosize
          minRows={1}
          maxRows={4}
          value={messageInput}
          onChange={(event) => setMessageInput(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          styles={{
            input: {
              fontSize: '14px',
              lineHeight: '1.5',
              padding: '10px 12px',
            }
          }}
          rightSection={
            <ActionIcon
              size="lg"
              className='m-3'
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <IconSend2 />
            </ActionIcon>
          }
        />
      </div>
    </div>
  )
}

export default ChatMessage