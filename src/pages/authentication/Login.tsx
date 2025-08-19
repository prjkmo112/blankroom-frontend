import { authApi } from "@/api"
import { PageRoutes } from "@/routes"
import { usePageStore } from "@/stores/pageStore"
import { useUIStore } from "@/stores/uiStore"
import { useUserStore } from "@/stores/userStore"
import { TextInput, PasswordInput, Button } from "@mantine/core"
import { enqueueSnackbar } from "notistack"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setBaseInfo } = usePageStore()
  const { setLoading } = useUIStore()
  const { setUserInfo } = useUserStore()

  async function refreshUserInfo() {
    try {
      const { data } = await authApi.authControllerGetProfile()
      setUserInfo({ nickname: data.nickname })
      navigate(PageRoutes.ROOM_LIST)
      enqueueSnackbar('Login successful!', { variant: 'success' })
    } catch (__err) {
      setUserInfo(null)
      enqueueSnackbar('Login Fail', { variant: 'error' })
    }
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const id = formData.get('id') as string
      const password = formData.get('password') as string

      const { data } = await authApi.authControllerLogin({ username: id, password })
      if (data.message === "ok")
        await refreshUserInfo()
      else
        throw new Error((data && data.message) || 'Login failed')
    } catch (err) {
      let msg = 'Login failed. Please try again'
      if ((err as any).status === 409)
        msg = 'User already exists'
      enqueueSnackbar(msg, { variant: 'error' })
    }

    setLoading(false)
  }

  useEffect(() => {
    setBaseInfo({
      title: 'Login',
      description: 'Please enter your credentials to log in.'
    })

    refreshUserInfo()
  }, [])

  return (
    <form className="space-y-6" onSubmit={(e) => login(e)}>
      <TextInput
        name="id"
        label="ID"
        placeholder="Enter your id"
        required
      />
      <PasswordInput
        name="password"
        label="Password"
        placeholder="Enter your password"
        required
      />

      <Button type="submit" color="blue" fullWidth mt="md">Login</Button>
    </form>
  )
}

export default LoginPage