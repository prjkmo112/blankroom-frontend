import { Box, LoadingOverlay, MantineProvider } from '@mantine/core'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { useEffect } from 'react'
import { PageRoutes } from './routes'
import MainLayout from './layouts/MainLayout'
import AccountLayout from './layouts/AccountLayout'
import RoomListPage from './pages/room/RoomList'
import CreateRoomPage from './pages/room/RoomCreate'
import RoomItemPage from './pages/room/RoomItem'
import LoginPage from './pages/authentication/Login'
import RegisterPage from './pages/authentication/Register'
import { useUIStore } from './stores/uiStore'
import { useUserStore } from './stores/userStore'


export default function App() {
  const { isLoading } = useUIStore()
  const { userInfo, setUserInfo } = useUserStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleUnauthorized = () => {
      setUserInfo(null)
      if (location.pathname !== '/login')
        navigate(PageRoutes.LOGIN, { replace: true })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [navigate])

  return (
    <MantineProvider withStaticClasses={false}>
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Routes>
          <Route element={<MainLayout />}>
            {!userInfo ? (
              <Route element={<AccountLayout />}>
                <Route path={PageRoutes.LOGIN} element={<LoginPage />} />
                <Route path={PageRoutes.REGISTER} element={<RegisterPage />} />
                <Route path='*' element={<Navigate to={PageRoutes.LOGIN} replace />} />
              </Route>
            ) : (
              <>
                <Route path={PageRoutes.ROOM_LIST} element={<RoomListPage />} />
                <Route path={PageRoutes.CREATE_ROOM} element={<CreateRoomPage />} />
                <Route path={PageRoutes.ROOM_ITEM} element={<RoomItemPage />} />
                <Route path='*' element={<Navigate to={PageRoutes.ROOM_LIST} replace />} />
              </>
            )}
          </Route>
        </Routes>

        <Box>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'pink', type: 'bars' }}
          />
          {/* ...other content */}
        </Box>
      </SnackbarProvider>
    </MantineProvider>
  )
}