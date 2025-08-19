import React, { useRef, useState, useEffect, MouseEvent } from 'react'
import { IconPencil, IconSquare, IconCircle, IconEraser, IconDownload, IconTrash } from '@tabler/icons-react'
import { Button, Center, Divider, SegmentedControl } from '@mantine/core'

interface Position {
  x: number;
  y: number;
}

interface Tool {
  id: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

type ToolType = 'pen' | 'rectangle' | 'circle' | 'eraser';

interface DrawingCanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement|null>;
  canvasWidth?: number | string;
  canvasHeight?: number | string;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = (props) => {
  const {
    canvasWidth = 900,
    canvasHeight = 600,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    canvasRef = useRef<HTMLCanvasElement>(null)
  } = props

  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [tool, setTool] = useState<ToolType>('pen')
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 })
  const [baseImageData, setBaseImageData] = useState<ImageData | null>(null)
  const [eraserPath, setEraserPath] = useState<Position[]>([])
  const [strokeWidth, setStrokeWidth] = useState<number>(2)
  const [eraserSize, setEraserSize] = useState<number>(10)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 캔버스 초기 설정
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = '#000000'
  }, [canvasRef, strokeWidth])

  const getMousePos = (e: MouseEvent<HTMLCanvasElement>): Position => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>): void => {
    const pos = getMousePos(e)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    setStartPos(pos)

    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = strokeWidth
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
    } else if (tool === 'eraser') {
      // 지우개 시작 시 현재 상태 저장하고 경로 초기화
      setBaseImageData(ctx.getImageData(0, 0, canvas.width, canvas.height))
      setEraserPath([pos])
    } else if (tool === 'rectangle' || tool === 'circle') {
      // 도형 그리기 시작 시 현재 캔버스 상태 저장
      setBaseImageData(ctx.getImageData(0, 0, canvas.width, canvas.height))
    }
  }

  const draw = (e: MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing) return

    const pos = getMousePos(e)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (tool === 'pen') {
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (tool === 'eraser') {
      // 현재 위치를 경로에 추가
      setEraserPath(prev => [...prev, pos])

      // 이전 상태로 복원
      if (baseImageData)
        ctx.putImageData(baseImageData, 0, 0)

      // 모든 지우개 경로 적용
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      eraserPath.concat([pos]).forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, eraserSize, 0, 2 * Math.PI)
        ctx.fill()
      })
      ctx.restore()

      // 지우개 미리보기 원 그리기
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, eraserSize, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.restore()
    } else if (tool === 'rectangle' || tool === 'circle') {
      // 이전 상태로 복원
      if (baseImageData)
        ctx.putImageData(baseImageData, 0, 0)

      // 점선 스타일로 미리보기 그리기
      ctx.save()
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = '#999999'
      ctx.lineWidth = Math.max(1, strokeWidth / 2)
      ctx.globalCompositeOperation = 'source-over'

      if (tool === 'rectangle') {
        ctx.strokeRect(
          startPos.x,
          startPos.y,
          pos.x - startPos.x,
          pos.y - startPos.y
        )
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
        )
        ctx.beginPath()
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
        ctx.stroke()
      }

      ctx.restore()
    }
  }

  const stopDrawing = (e: MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing) return

    const pos = getMousePos(e)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (tool === 'eraser') {
      // 지우개 종료 시 최종 상태로 정리 (빨간 점선 제거)
      if (baseImageData) {
        ctx.putImageData(baseImageData, 0, 0)

        // 최종 지우개 효과만 적용
        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        eraserPath.forEach(point => {
          ctx.beginPath()
          ctx.arc(point.x, point.y, eraserSize, 0, 2 * Math.PI)
          ctx.fill()
        })
        ctx.restore()
      }
      setEraserPath([])
    } else if (tool === 'rectangle' || tool === 'circle') {
      // 이전 상태로 복원
      if (baseImageData)
        ctx.putImageData(baseImageData, 0, 0)

      // 실제 도형 그리기
      ctx.save()
      ctx.setLineDash([])
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = strokeWidth
      ctx.globalCompositeOperation = 'source-over'

      if (tool === 'rectangle') {
        ctx.strokeRect(
          startPos.x,
          startPos.y,
          pos.x - startPos.x,
          pos.y - startPos.y
        )
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
        )
        ctx.beginPath()
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
        ctx.stroke()
      }

      ctx.restore()
    }

    setIsDrawing(false)
    setBaseImageData(null)
  }

  const clearCanvas = (): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const downloadImage = (): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const tools: Tool[] = [
    { id: 'pen', icon: IconPencil, label: '펜' },
    { id: 'rectangle', icon: IconSquare, label: '사각형' },
    { id: 'circle', icon: IconCircle, label: '원' },
    { id: 'eraser', icon: IconEraser, label: '지우개' }
  ]

  return (
    <div
      className="inline-block bg-white rounded-lg shadow-lg p-4"
    >
      {/* 툴바 */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded-lg flex-wrap">
        <div>
          <SegmentedControl
            size="md"
            radius="md"
            value={tool}
            onChange={(value) => setTool(value as ToolType)}
            data={tools.map(({ id, icon: Icon, label }) => ({
              value: id,
              label: (
                <Center className="gap-2">
                  <Icon size={18} />
                  <span>{label}</span>
                </Center>
              )
            }))}
          />
        </div>

        <Divider orientation="vertical" />

        {/* 두께 설정 */}
        <div className="flex items-center gap-2">
          {tool === 'eraser' ? (
            <>
              <label className="text-sm font-medium text-gray-700">지우개 크기:</label>
              <input
                type="range"
                min="5"
                max="50"
                value={eraserSize}
                onChange={(e) => setEraserSize(parseInt(e.target.value))}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 w-8">{eraserSize}</span>
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-gray-700">두께:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 w-8">{strokeWidth}</span>
            </>
          )}
        </div>

        <Divider orientation="vertical" />

        <Button leftSection={<IconTrash />} onClick={clearCanvas} color='red'>전체 지우기</Button>
        <Button leftSection={<IconDownload />} onClick={downloadImage}>다운로드</Button>
      </div>

      {/* 캔버스 */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="block cursor-crosshair bg-white select-none touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* 상태 표시 */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        현재 도구: <span className="font-semibold">{tools.find(t => t.id === tool)?.label}</span>
        {tool === 'eraser' && ` (크기: ${eraserSize}px)`}
        {(tool === 'pen' || tool === 'rectangle' || tool === 'circle') && ` (두께: ${strokeWidth}px)`}
      </div>
    </div>
  )
}

export default DrawingCanvas