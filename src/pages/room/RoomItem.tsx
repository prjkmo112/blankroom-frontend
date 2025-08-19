import { boardApi, roomApi } from "@/api"
import ChatMessage from "@/components/ChatMessage"
import DrawingCanvas from "@/components/DrawingCanvas"
import { useUIStore } from "@/stores/uiStore"
import { useChatStore } from "@/stores/chatStore"
import { enqueueSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

interface RoomInfo {
  id: string;
  shortId: string;
  title: string;
  description?: string;
}

function RoomItemPage() {
  const { setLoading } = useUIStore()
  const { connect, disconnect, joinRoom, leaveRoom, getChatHistory, isConnected, clearMessages } = useChatStore()

  const { roomId } = useParams<{ roomId: string }>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [ lastSyncTime, setLastSyncTime ] = useState<string>('')
  const [ roomInfo, setRoomInfo ] = useState<RoomInfo|null>(null)

  const saveImage = () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.toBlob(async (blob) => {
        if (!blob || !roomInfo?.id) return

        const { data: success } = await boardApi.boardControllerUpsertBoardForm(blob, roomInfo?.id)
        if (!success)
          throw new Error('Failed to save image')
      })

      setLastSyncTime(new Date().toLocaleTimeString())
    } catch (__err) {
      enqueueSnackbar('Failed to save image. Please try again.', { variant: 'error' })
    }
  }

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        const rooomInfoResult = await roomApi.roomControllerGetRoom(undefined, roomId)
        setRoomInfo({
          id: rooomInfoResult.data.id,
          shortId: rooomInfoResult.data.short_id,
          title: rooomInfoResult.data.name,
          description: rooomInfoResult.data.description || ''
        })

        const boardInfo = await boardApi.boardControllerGetBoard(rooomInfoResult.data.id)

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        if (!boardInfo.data || !boardInfo.data.image_data) return

        const uint8arr = new Uint8Array(Object.values(boardInfo.data.image_data))

        const blob = new Blob([uint8arr], { type: 'image/png' })
        const url = URL.createObjectURL(blob)

        const img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          URL.revokeObjectURL(url)
        }
        img.src = url

        if (!isConnected)
          await connect()

        if (rooomInfoResult.data.id) {
          clearMessages()
          joinRoom(rooomInfoResult.data.id)
          getChatHistory(rooomInfoResult.data.id, 1, 20)
        }
      } catch (__e) {
        console.error(__e)
        enqueueSnackbar('Failed to load room data. Please try again.', { variant: 'error', autoHideDuration: 5000 })
      } finally {
        setLoading(false)
      }
    })()
  }, [roomId])

  useEffect(() => {
    return () => {
      if (roomInfo?.id)
        leaveRoom(roomInfo.id)

      disconnect()
    }
  }, [roomInfo?.id])

  useEffect(() => {
    const intervalId = setInterval(() => {
      saveImage()
    }, 1000 * 5)

    return () => {
      clearInterval(intervalId)
    }
  }, [roomInfo?.id])

  return (
    <div>
      <span className="flex-wrap opacity-30 font-bold">마지막 연동 시간: {lastSyncTime}</span>
      <div className="flex flex-wrap space-4 p-4">
        <div>
          <DrawingCanvas canvasRef={canvasRef} />
        </div>
        <div className="flex-1 max-h-[72vh] min-w-[20rem]">
          {roomInfo?.id && <ChatMessage roomId={roomInfo.id} />}
        </div>
      </div>
    </div>
  )
}

export default RoomItemPage