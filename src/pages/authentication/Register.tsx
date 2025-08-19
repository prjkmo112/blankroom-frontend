import { authApi } from "@/api"
import { PageRoutes } from "@/routes"
import { usePageStore } from "@/stores/pageStore"
import { useUIStore } from "@/stores/uiStore"
import { Button, PasswordInput, TextInput } from "@mantine/core"
import { enqueueSnackbar } from "notistack"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { setBaseInfo } = usePageStore()
  const { setLoading } = useUIStore()

  const register = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const nickname = formData.get('nickname') as string
      const id = formData.get('id') as string
      const password = formData.get('password') as string

      const { data } = await authApi.authControllerRegister({ nickname, id, password })
      if (data.message === "ok") {
        enqueueSnackbar('Registration successful!', { variant: 'success' })
        navigate(PageRoutes.LOGIN)
      } else
        throw new Error((data && data.message) || 'Registration failed')
    } catch (err) {
      let msg = 'Registration failed. Please try again'
      if ((err as any).status === 409)
        msg = 'User already exists'
      enqueueSnackbar(msg, { variant: 'error' })
    }

    setLoading(false)
  }

  useEffect(() => {
    setBaseInfo({
      title: 'Register',
      description: 'Please fill in the form to register a new account.'
    })
  }, [])

  return (
    <form className="space-y-6" onSubmit={(e) => register(e)}>
      <TextInput
        name="nickname"
        label="nickname"
        placeholder="Enter your nickname"
        required
      />
      <TextInput
        name="id"
        label="id"
        placeholder="Enter your id"
        required
      />
      <PasswordInput
        name="password"
        label="password"
        placeholder="Enter your password"
        required
      />

      <Button type="submit" color="blue" fullWidth mt="md">Register</Button>
    </form>
  )
}

export default RegisterPage