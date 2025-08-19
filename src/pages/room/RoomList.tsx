import { ListRoomsDto, roomApi } from '@/api'
import { Nothing } from '@/components/Nothing'
import { PageRoutes } from '@/routes'
import CardList, { CardListProps } from '@components/CardList'
import { Button } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RoomListPage() {
  const navigate = useNavigate()

  const [ rooms, setRooms ] = useState<CardListProps['items']>([])

  useEffect(() => {
    (async () => {
      const { data } = await roomApi.roomControllerListRooms()
      console.log(data)
      const roomCardList: CardListProps['items'] = data.map((room: ListRoomsDto) => ({
        title: room.name,
        image: null,
        date: new Date(room.created_at).toLocaleDateString(),
        description: room.description || 'No description',
        url: `/rooms/${room.short_id}`
      }))
      setRooms(roomCardList)
    })()
  }, [])

  return (
    <>
      <div style={{ textAlign: "end" }}>
        <Button
          style={{ margin: "10px 10vw" }}
          onClick={() => navigate(PageRoutes.CREATE_ROOM)}
        >
          Add New Board
        </Button>
      </div>
      {rooms.length === 0 ? (
        <Nothing />
      ) : (
        <CardList items={rooms} />
      )}
    </>
  )
}

export default RoomListPage