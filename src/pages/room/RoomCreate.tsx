import { roomApi } from "@/api"
import { PageRoutes } from "@/routes"
import { useUIStore } from "@/stores/uiStore"
import { Button, Input, PinInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { enqueueSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"

function CreateRoomPage() {
  const { setLoading } = useUIStore()
  const navigate = useNavigate()

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { name: '', description: '', password: '' },

    validate: {
      name: (value) => (value.trim().length < 1 ? 'Room name is required' : null),
      password: (value) => (value && value.length < 6 ? 'Password must be at least 6 characters' : null),
    }
  })

  const submitHandler = async (values: { name: string; description: string; password: string }) => {
    setLoading(true)
    let success = false
    try {
      const { data } = await roomApi.roomControllerCreateRoom(values)
      if (data)
        success = true
    } catch (__e) {
      // intentionally left blank
    }
    if (success) {
      enqueueSnackbar('Room created successfully!', { variant: 'success' })
      navigate(PageRoutes.ROOM_LIST)
    } else
      enqueueSnackbar('Failed to create room. Please try again.', { variant: 'error' })

    setLoading(false)
  }

  return (
    <form style={{ margin: "0 auto", width: "20vw" }} onSubmit={form.onSubmit(submitHandler)}>
      {/* <Input.Wrapper label="Room Name" required> */}
      <TextInput
        label="Room Name"
        required
        placeholder="Enter room name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      {/* </Input.Wrapper> */}

      <TextInput
        label="Room Description"
        placeholder="Enter room description"
        style={{ marginTop: "1.5rem" }}
        key={form.key('description')}
        {...form.getInputProps('description')}
      />

      <Input.Wrapper label="Room Password" description="Optional" style={{ marginTop: "1.5rem" }}>
        <PinInput
          length={6}
          inputMode="numeric"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
      </Input.Wrapper>

      <Button
        type="submit"
        color="blue"
        variant="filled"
        fullWidth
        style={{ marginTop: "2rem" }}
      >
        Create Room
      </Button>
    </form>
  )
}

export default CreateRoomPage